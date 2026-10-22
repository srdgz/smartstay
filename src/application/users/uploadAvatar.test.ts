import { beforeEach, describe, expect, it } from "vitest";

import { NotFoundError, ValidationError } from "@/domain/errors";
import { AVATAR_MAX_BYTES } from "@/domain/user/avatar";
import { buildUser, FakeAvatarStorage, InMemoryUserRepository } from "@/test/fakes";

import { makeRemoveAvatar, makeUploadAvatar } from "./uploadAvatar";

const png = (size = 64) => {
  const bytes = new Uint8Array(size);
  bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return bytes;
};

const jpeg = () => new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46]);

describe("uploadAvatar", () => {
  let users: InMemoryUserRepository;
  let avatars: FakeAvatarStorage;
  let uploadAvatar: ReturnType<typeof makeUploadAvatar>;

  beforeEach(() => {
    users = new InMemoryUserRepository([buildUser()]);
    avatars = new FakeAvatarStorage();
    uploadAvatar = makeUploadAvatar({ users, avatars });
  });

  it("stores the image and saves its address on the user", async () => {
    const result = await uploadAvatar({ userId: "user-1", bytes: png() });

    expect(result).toEqual({ url: "https://cdn.example.com/avatar-user-1.png" });
    expect(avatars.uploads).toHaveLength(1);
    expect(avatars.uploads[0]).toMatchObject({
      contentType: "image/png",
      filename: "avatar-user-1.png",
    });
    expect(users.users[0].image).toBe("https://cdn.example.com/avatar-user-1.png");
  });

  it("names the file after the detected format, not the declared one", async () => {
    await uploadAvatar({ userId: "user-1", bytes: jpeg() });
    expect(avatars.uploads[0]).toMatchObject({
      contentType: "image/jpeg",
      filename: "avatar-user-1.jpg",
    });
  });

  it("rejects files that are not JPEG, PNG or WebP images", async () => {
    const svg = new TextEncoder().encode("<svg onload='alert(1)'></svg>");

    await expect(uploadAvatar({ userId: "user-1", bytes: svg })).rejects.toMatchObject({
      code: "avatarType",
    });
    expect(avatars.uploads).toHaveLength(0);
    expect(users.users[0].image).toBeNull();
  });

  it("rejects empty and oversized files before touching storage", async () => {
    await expect(
      uploadAvatar({ userId: "user-1", bytes: new Uint8Array() })
    ).rejects.toMatchObject({ code: "avatarRequired" });
    await expect(
      uploadAvatar({ userId: "user-1", bytes: png(AVATAR_MAX_BYTES + 1) })
    ).rejects.toMatchObject({ code: "avatarTooLarge", params: { max: 2 } });
    expect(avatars.uploads).toHaveLength(0);
  });

  it("fails for users that do not exist", async () => {
    await expect(uploadAvatar({ userId: "ghost", bytes: png() })).rejects.toBeInstanceOf(
      NotFoundError
    );
    expect(avatars.uploads).toHaveLength(0);
  });

  it("reports validation problems as validation errors", async () => {
    await expect(uploadAvatar({ userId: "user-1", bytes: new Uint8Array([1, 2, 3]) })).rejects.toBeInstanceOf(
      ValidationError
    );
  });
});

describe("removeAvatar", () => {
  it("clears the saved image", async () => {
    const users = new InMemoryUserRepository([buildUser({ image: "https://cdn.example.com/a.png" })]);

    const result = await makeRemoveAvatar({ users })("user-1");

    expect(result).toEqual({ url: null });
    expect(users.users[0].image).toBeNull();
  });

  it("fails for users that do not exist", async () => {
    const users = new InMemoryUserRepository();
    await expect(makeRemoveAvatar({ users })("ghost")).rejects.toBeInstanceOf(NotFoundError);
  });
});

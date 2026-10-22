// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UnauthorizedError } from "@/domain/errors";
import { AVATAR_MAX_BYTES } from "@/domain/user/avatar";

import { DELETE, POST } from "./route";

const uploadAvatar = vi.fn();
const removeAvatar = vi.fn();
const requireUserId = vi.fn();

vi.mock("@/infrastructure/container", () => ({
  useCases: {
    uploadAvatar: (...args: unknown[]) => uploadAvatar(...args),
    removeAvatar: (...args: unknown[]) => removeAvatar(...args),
  },
}));

vi.mock("@/infrastructure/auth/session", () => ({
  requireUserId: () => requireUserId(),
}));

const upload = (file?: File) => {
  const form = new FormData();
  if (file) form.append("avatar", file);
  return new Request("http://localhost/api/me/avatar", { method: "POST", body: form });
};

const png = (size = 64) => new File([new Uint8Array(size)], "me.png", { type: "image/png" });

describe("POST /api/me/avatar", () => {
  beforeEach(() => {
    requireUserId.mockResolvedValue("user-1");
    uploadAvatar.mockResolvedValue({ url: "https://cdn.sanity.io/images/p/d/a.png" });
  });

  it("passes the uploaded bytes of the logged-in user to the use case", async () => {
    const response = await POST(upload(png(8)));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ url: "https://cdn.sanity.io/images/p/d/a.png" });
    expect(uploadAvatar).toHaveBeenCalledWith({
      userId: "user-1",
      bytes: expect.any(Uint8Array),
    });
    expect(uploadAvatar.mock.calls[0][0].bytes.byteLength).toBe(8);
  });

  it("requires a login", async () => {
    requireUserId.mockRejectedValue(new UnauthorizedError("You must be logged in.", "unauthorized"));

    const response = await POST(upload(png()));

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ code: "unauthorized" });
    expect(uploadAvatar).not.toHaveBeenCalled();
  });

  it("asks for an image when the form has no file", async () => {
    const response = await POST(upload());

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ code: "avatarRequired" });
    expect(uploadAvatar).not.toHaveBeenCalled();
  });

  it("asks for an image when the body is not a form", async () => {
    const response = await POST(
      new Request("http://localhost/api/me/avatar", { method: "POST", body: "nope" })
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ code: "avatarRequired" });
  });

  it("rejects files over the limit without reading them", async () => {
    const response = await POST(upload(png(AVATAR_MAX_BYTES + 1)));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      code: "avatarTooLarge",
      params: { max: 2 },
    });
    expect(uploadAvatar).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/me/avatar", () => {
  it("removes the photo of the logged-in user", async () => {
    requireUserId.mockResolvedValue("user-1");
    removeAvatar.mockResolvedValue({ url: null });

    const response = await DELETE();

    expect(response.status).toBe(200);
    expect(removeAvatar).toHaveBeenCalledWith("user-1");
  });

  it("requires a login", async () => {
    requireUserId.mockRejectedValue(new UnauthorizedError("You must be logged in.", "unauthorized"));

    const response = await DELETE();

    expect(response.status).toBe(401);
  });
});

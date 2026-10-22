import { NotFoundError, ValidationError } from "@/domain/errors";
import {
  assertAvatarSize,
  AVATAR_EXTENSIONS,
  detectImageType,
} from "@/domain/user/avatar";
import type { UserRepository } from "@/domain/user/UserRepository";

import type { AvatarStorage } from "../ports/AvatarStorage";

type Dependencies = {
  users: UserRepository;
  avatars: AvatarStorage;
};

export const makeUploadAvatar =
  ({ users, avatars }: Dependencies) =>
  async ({ userId, bytes }: { userId: string; bytes: Uint8Array }) => {
    assertAvatarSize(bytes.byteLength);

    const contentType = detectImageType(bytes);
    if (!contentType) {
      throw new ValidationError("Use a JPG, PNG or WebP image.", "avatarType");
    }

    const user = await users.findById(userId);
    if (!user) throw new NotFoundError("We could not find your profile.", "userNotFound");

    const { url } = await avatars.upload({
      bytes,
      contentType,
      filename: `avatar-${userId}.${AVATAR_EXTENSIONS[contentType]}`,
    });
    await users.updateImage(userId, url);

    return { url };
  };

export const makeRemoveAvatar =
  ({ users }: { users: UserRepository }) =>
  async (userId: string) => {
    const user = await users.findById(userId);
    if (!user) throw new NotFoundError("We could not find your profile.", "userNotFound");

    await users.updateImage(userId, null);
    return { url: null };
  };

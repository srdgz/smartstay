import { ValidationError, type ErrorParams } from "../errors";

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
export const AVATAR_MAX_MEGABYTES = AVATAR_MAX_BYTES / (1024 * 1024);

export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type AvatarType = (typeof AVATAR_TYPES)[number];

export const AVATAR_EXTENSIONS: Record<AvatarType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const isAvatarType = (value: string): value is AvatarType =>
  (AVATAR_TYPES as readonly string[]).includes(value);

const startsWith = (bytes: Uint8Array, signature: number[], offset = 0) =>
  signature.every((value, index) => bytes[offset + index] === value);

export const detectImageType = (bytes: Uint8Array): AvatarType | null => {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)) {
    return "image/webp";
  }
  return null;
};

export type AvatarFileProblem = { code: string; params: ErrorParams };

export const avatarFileProblem = (size: number, type?: string): AvatarFileProblem | null => {
  if (size <= 0) return { code: "avatarRequired", params: {} };
  if (size > AVATAR_MAX_BYTES) {
    return { code: "avatarTooLarge", params: { max: AVATAR_MAX_MEGABYTES } };
  }
  if (type !== undefined && !isAvatarType(type)) return { code: "avatarType", params: {} };
  return null;
};

export const assertAvatarSize = (size: number) => {
  const problem = avatarFileProblem(size);
  if (!problem) return;

  throw new ValidationError(
    problem.code === "avatarTooLarge"
      ? `The image is too large. The maximum size is ${AVATAR_MAX_MEGABYTES} MB.`
      : "Please choose an image.",
    problem.code,
    problem.params
  );
};

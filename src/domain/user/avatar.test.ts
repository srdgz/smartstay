import { describe, expect, it } from "vitest";

import { ValidationError } from "../errors";
import {
  assertAvatarSize,
  avatarFileProblem,
  AVATAR_MAX_BYTES,
  detectImageType,
  isAvatarType,
} from "./avatar";

const bytes = (...values: number[]) => new Uint8Array(values);

describe("detectImageType", () => {
  it("recognizes JPEG, PNG and WebP by their signatures", () => {
    expect(detectImageType(bytes(0xff, 0xd8, 0xff, 0xe0, 0, 0x10))).toBe("image/jpeg");
    expect(detectImageType(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0))).toBe(
      "image/png"
    );
    expect(
      detectImageType(
        bytes(0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x45, 0x42, 0x50, 0x56, 0x50)
      )
    ).toBe("image/webp");
  });

  it("rejects GIF, SVG, RIFF files that are not WebP and random data", () => {
    expect(detectImageType(new TextEncoder().encode("GIF89a......"))).toBeNull();
    expect(detectImageType(new TextEncoder().encode("<svg xmlns='http://www.w3.org/2000/svg'/>"))).toBeNull();
    expect(
      detectImageType(bytes(0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x41, 0x56, 0x45))
    ).toBeNull();
    expect(detectImageType(bytes(1, 2, 3))).toBeNull();
    expect(detectImageType(new Uint8Array())).toBeNull();
  });
});

describe("avatarFileProblem", () => {
  it("accepts supported images within the size limit", () => {
    expect(avatarFileProblem(1024, "image/png")).toBeNull();
    expect(avatarFileProblem(AVATAR_MAX_BYTES, "image/webp")).toBeNull();
  });

  it("reports empty, oversized and unsupported files with a translatable code", () => {
    expect(avatarFileProblem(0, "image/png")).toEqual({ code: "avatarRequired", params: {} });
    expect(avatarFileProblem(AVATAR_MAX_BYTES + 1, "image/png")).toEqual({
      code: "avatarTooLarge",
      params: { max: 2 },
    });
    expect(avatarFileProblem(1024, "image/gif")).toEqual({ code: "avatarType", params: {} });
    expect(avatarFileProblem(1024, "image/svg+xml")?.code).toBe("avatarType");
  });

  it("skips the type check when only the size is known", () => {
    expect(avatarFileProblem(1024)).toBeNull();
  });
});

describe("assertAvatarSize", () => {
  it("throws a validation error with the code the UI translates", () => {
    expect(() => assertAvatarSize(AVATAR_MAX_BYTES + 1)).toThrowError(
      expect.objectContaining({ code: "avatarTooLarge", params: { max: 2 } })
    );
    expect(() => assertAvatarSize(0)).toThrow(ValidationError);
    expect(() => assertAvatarSize(10)).not.toThrow();
  });
});

describe("isAvatarType", () => {
  it("only allows the supported media types", () => {
    expect(isAvatarType("image/jpeg")).toBe(true);
    expect(isAvatarType("image/svg+xml")).toBe(false);
  });
});

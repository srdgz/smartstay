import type { SanityClient } from "next-sanity";
import { describe, expect, it, vi } from "vitest";

import { SanityAvatarStorage } from "./SanityAvatarStorage";
import { SanityUserRepository } from "./SanityUserRepository";

describe("SanityAvatarStorage", () => {
  it("uploads the bytes as an image asset and returns its CDN address", async () => {
    const upload = vi.fn().mockResolvedValue({ url: "https://cdn.sanity.io/images/p/d/abc.png" });
    const storage = new SanityAvatarStorage({ assets: { upload } } as unknown as SanityClient);

    const result = await storage.upload({
      bytes: new Uint8Array([1, 2, 3]),
      contentType: "image/png",
      filename: "avatar-user-1.png",
    });

    expect(result).toEqual({ url: "https://cdn.sanity.io/images/p/d/abc.png" });
    expect(upload).toHaveBeenCalledWith("image", expect.any(Buffer), {
      filename: "avatar-user-1.png",
      contentType: "image/png",
    });
  });
});

describe("SanityUserRepository.updateImage", () => {
  const clientWith = () => {
    const commit = vi.fn().mockResolvedValue({});
    const set = vi.fn(() => ({ commit }));
    const unset = vi.fn(() => ({ commit }));
    const patch = vi.fn(() => ({ set, unset }));
    return { client: { patch } as unknown as SanityClient, patch, set, unset, commit };
  };

  it("sets the image field when a URL is given", async () => {
    const { client, patch, set, commit } = clientWith();

    await new SanityUserRepository(client).updateImage("user-1", "https://cdn/x.png");

    expect(patch).toHaveBeenCalledWith("user-1");
    expect(set).toHaveBeenCalledWith({ image: "https://cdn/x.png" });
    expect(commit).toHaveBeenCalled();
  });

  it("removes the image field when no URL is given", async () => {
    const { client, unset, commit } = clientWith();

    await new SanityUserRepository(client).updateImage("user-1", null);

    expect(unset).toHaveBeenCalledWith(["image"]);
    expect(commit).toHaveBeenCalled();
  });
});

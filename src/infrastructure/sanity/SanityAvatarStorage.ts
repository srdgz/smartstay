import type { SanityClient } from "next-sanity";

import type { AvatarStorage, AvatarUpload } from "@/application/ports/AvatarStorage";

export class SanityAvatarStorage implements AvatarStorage {
  constructor(private readonly client: SanityClient) {}

  async upload({ bytes, contentType, filename }: AvatarUpload): Promise<{ url: string }> {
    const asset = await this.client.assets.upload("image", Buffer.from(bytes), {
      filename,
      contentType,
    });

    return { url: asset.url };
  }
}

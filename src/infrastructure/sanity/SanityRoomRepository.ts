import type { SanityClient } from "next-sanity";

import type { ContentLocale } from "@/domain/locale";
import type { Room } from "@/domain/room/Room";
import type { RoomRepository } from "@/domain/room/RoomRepository";

import { toRoom, type SanityRoomDoc } from "./mappers";
import { featuredRoomQuery, roomBySlugQuery, roomsQuery } from "./queries";

const noCache = { cache: "no-cache" } as const;

export class SanityRoomRepository implements RoomRepository {
  constructor(private readonly client: SanityClient) {}

  async findFeatured(locale: ContentLocale): Promise<Room | null> {
    const doc = await this.client.fetch<SanityRoomDoc | null>(featuredRoomQuery, {}, noCache);
    return doc ? toRoom(doc, locale) : null;
  }

  async findAll(locale: ContentLocale): Promise<Room[]> {
    const docs = await this.client.fetch<SanityRoomDoc[]>(roomsQuery, {}, noCache);
    return docs.map((doc) => toRoom(doc, locale));
  }

  async findBySlug(slug: string, locale: ContentLocale): Promise<Room | null> {
    const doc = await this.client.fetch<SanityRoomDoc | null>(roomBySlugQuery, { slug }, noCache);
    return doc ? toRoom(doc, locale) : null;
  }

}

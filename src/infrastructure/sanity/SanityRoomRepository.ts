import type { SanityClient } from "next-sanity";

import type { Room } from "@/domain/room/Room";
import type { RoomRepository } from "@/domain/room/RoomRepository";

import { toRoom, type SanityRoomDoc } from "./mappers";
import { featuredRoomQuery, roomBySlugQuery, roomsQuery } from "./queries";

const noCache = { cache: "no-cache" } as const;

export class SanityRoomRepository implements RoomRepository {
  constructor(private readonly client: SanityClient) {}

  async findFeatured(): Promise<Room | null> {
    const doc = await this.client.fetch<SanityRoomDoc | null>(featuredRoomQuery, {}, noCache);
    return doc ? toRoom(doc) : null;
  }

  async findAll(): Promise<Room[]> {
    const docs = await this.client.fetch<SanityRoomDoc[]>(roomsQuery, {}, noCache);
    return docs.map(toRoom);
  }

  async findBySlug(slug: string): Promise<Room | null> {
    const doc = await this.client.fetch<SanityRoomDoc | null>(roomBySlugQuery, { slug }, noCache);
    return doc ? toRoom(doc) : null;
  }

  async markAsBooked(roomId: string): Promise<void> {
    await this.client.patch(roomId).set({ isBooked: true }).commit();
  }
}

import type { Room } from "./Room";

export interface RoomRepository {
  findFeatured(): Promise<Room | null>;
  findAll(): Promise<Room[]>;
  findBySlug(slug: string): Promise<Room | null>;
  markAsBooked(roomId: string): Promise<void>;
}

import { NotFoundError } from "@/domain/errors";
import type { RoomRepository } from "@/domain/room/RoomRepository";

export const makeGetRoom =
  ({ rooms }: { rooms: RoomRepository }) =>
  async (slug: string) => {
    const room = await rooms.findBySlug(slug);
    if (!room) throw new NotFoundError("We could not find that room.");
    return room;
  };

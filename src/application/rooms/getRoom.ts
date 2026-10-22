import { NotFoundError } from "@/domain/errors";
import { toContentLocale } from "@/domain/locale";
import type { RoomRepository } from "@/domain/room/RoomRepository";

export const makeGetRoom =
  ({ rooms }: { rooms: RoomRepository }) =>
  async (slug: string, locale: string) => {
    const room = await rooms.findBySlug(slug, toContentLocale(locale));
    if (!room) throw new NotFoundError("We could not find that room.", "roomNotFound");
    return room;
  };

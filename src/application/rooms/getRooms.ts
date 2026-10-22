import { toContentLocale } from "@/domain/locale";
import type { RoomRepository } from "@/domain/room/RoomRepository";

export const makeGetRooms =
  ({ rooms }: { rooms: RoomRepository }) =>
  (locale: string) =>
    rooms.findAll(toContentLocale(locale));

import { toContentLocale } from "@/domain/locale";
import type { RoomRepository } from "@/domain/room/RoomRepository";

export const makeGetFeaturedRoom =
  ({ rooms }: { rooms: RoomRepository }) =>
  (locale: string) =>
    rooms.findFeatured(toContentLocale(locale));

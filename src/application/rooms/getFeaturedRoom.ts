import type { RoomRepository } from "@/domain/room/RoomRepository";

export const makeGetFeaturedRoom =
  ({ rooms }: { rooms: RoomRepository }) =>
  () =>
    rooms.findFeatured();

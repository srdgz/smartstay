import type { RoomRepository } from "@/domain/room/RoomRepository";

export const makeGetRooms =
  ({ rooms }: { rooms: RoomRepository }) =>
  () =>
    rooms.findAll();

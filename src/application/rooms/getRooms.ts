import { isRoomAvailable } from "@/domain/booking/availability";
import type { BookingRepository } from "@/domain/booking/BookingRepository";
import { assertValidStay } from "@/domain/booking/stay";
import { toContentLocale } from "@/domain/locale";
import type { RoomRepository } from "@/domain/room/RoomRepository";

type Dependencies = {
  rooms: RoomRepository;
  bookings: BookingRepository;
  now?: () => Date;
};

export type RoomSearch = {
  checkinDate?: string;
  checkoutDate?: string;
};

export const makeGetRooms =
  ({ rooms, bookings, now = () => new Date() }: Dependencies) =>
  async (locale: string, { checkinDate, checkoutDate }: RoomSearch = {}) => {
    const all = await rooms.findAll(toContentLocale(locale));
    if (!checkinDate && !checkoutDate) return all;

    assertValidStay(checkinDate ?? "", checkoutDate ?? "", now());
    const stay = { checkinDate: checkinDate!, checkoutDate: checkoutDate! };
    const booked = await bookings.findBookedRanges(stay.checkinDate);

    return all.filter((room) => isRoomAvailable(room.id, stay, booked));
  };

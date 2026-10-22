import type { DateRange } from "@/domain/booking/availability";
import type { BookingRepository } from "@/domain/booking/BookingRepository";
import { NotFoundError } from "@/domain/errors";
import { toContentLocale } from "@/domain/locale";
import type { RoomRepository } from "@/domain/room/RoomRepository";

type Dependencies = {
  rooms: RoomRepository;
  bookings: BookingRepository;
  now?: () => Date;
};

export const makeGetRoomAvailability =
  ({ rooms, bookings, now = () => new Date() }: Dependencies) =>
  async (slug: string): Promise<{ booked: DateRange[] }> => {
    const room = await rooms.findBySlug(slug, toContentLocale("en"));
    if (!room) throw new NotFoundError("We could not find that room.", "roomNotFound");

    const today = now().toISOString().slice(0, 10);
    const ranges = await bookings.findBookedRanges(today);

    return {
      booked: ranges
        .filter((range) => range.roomId === room.id)
        .map(({ checkinDate, checkoutDate }) => ({ checkinDate, checkoutDate })),
    };
  };

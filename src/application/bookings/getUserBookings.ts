import type { BookingRepository } from "@/domain/booking/BookingRepository";

export const makeGetUserBookings =
  ({ bookings }: { bookings: BookingRepository }) =>
  (userId: string) =>
    bookings.findByUser(userId);

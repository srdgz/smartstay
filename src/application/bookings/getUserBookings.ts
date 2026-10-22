import type { BookingRepository } from "@/domain/booking/BookingRepository";
import { toContentLocale } from "@/domain/locale";

export const makeGetUserBookings =
  ({ bookings }: { bookings: BookingRepository }) =>
  (userId: string, locale: string) =>
    bookings.findByUser(userId, toContentLocale(locale));

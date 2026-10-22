import type { BookingRepository } from "@/domain/booking/BookingRepository";
import type { RoomRepository } from "@/domain/room/RoomRepository";

import type { PaymentGateway } from "../ports/PaymentGateway";
import { fromCheckoutMetadata } from "./checkoutMetadata";

type Dependencies = {
  payments: PaymentGateway;
  bookings: BookingRepository;
  rooms: RoomRepository;
};

export const makeCompleteBooking =
  ({ payments, bookings, rooms }: Dependencies) =>
  async (payload: string, signature: string | null) => {
    const completed = await payments.readCompletedCheckout(payload, signature);
    if (!completed) return { handled: false };

    const booking = fromCheckoutMetadata(completed.metadata);
    await bookings.create(booking);
    await rooms.markAsBooked(booking.roomId);

    return { handled: true };
  };

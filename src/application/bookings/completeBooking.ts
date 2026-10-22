import type { BookingRepository } from "@/domain/booking/BookingRepository";

import type { PaymentGateway } from "../ports/PaymentGateway";
import { fromCheckoutMetadata } from "./checkoutMetadata";

type Dependencies = {
  payments: PaymentGateway;
  bookings: BookingRepository;
};

export const makeCompleteBooking =
  ({ payments, bookings }: Dependencies) =>
  async (payload: string, signature: string | null) => {
    const completed = await payments.readCompletedCheckout(payload, signature);
    if (!completed) return { handled: false };

    const booking = fromCheckoutMetadata(completed.metadata);
    await bookings.create(booking);

    return { handled: true };
  };

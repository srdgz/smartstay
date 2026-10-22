import type { SanityClient } from "next-sanity";

import type { Booking, NewBooking } from "@/domain/booking/Booking";
import type { BookingRepository } from "@/domain/booking/BookingRepository";
import type { ContentLocale } from "@/domain/locale";

import { toBooking, type SanityBookingDoc } from "./mappers";
import { userBookingsQuery } from "./queries";

export class SanityBookingRepository implements BookingRepository {
  constructor(private readonly client: SanityClient) {}

  async create(booking: NewBooking): Promise<void> {
    await this.client.create({
      _type: "booking",
      user: { _type: "reference", _ref: booking.userId },
      hotelRoom: { _type: "reference", _ref: booking.roomId },
      checkinDate: booking.checkinDate,
      checkoutDate: booking.checkoutDate,
      numberOfDays: booking.numberOfDays,
      adults: booking.adults,
      children: booking.children,
      totalPrice: booking.totalPrice,
      discount: booking.discount,
      currency: booking.currency,
      exchangeRate: booking.exchangeRate,
      amountCharged: booking.chargedAmount,
    });
  }

  async findByUser(userId: string, locale: ContentLocale): Promise<Booking[]> {
    const docs = await this.client.fetch<SanityBookingDoc[]>(
      userBookingsQuery,
      { userId },
      { cache: "no-cache" }
    );
    return docs
      .map((doc) => toBooking(doc, locale))
      .filter((booking): booking is Booking => booking !== null);
  }
}

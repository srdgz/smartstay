import { describe, expect, it } from "vitest";

import { ValidationError } from "@/domain/errors";
import {
  buildRoom,
  FakePaymentGateway,
  InMemoryBookingRepository,
  InMemoryRoomRepository,
} from "@/test/fakes";

import { fromCheckoutMetadata, toCheckoutMetadata } from "./checkoutMetadata";
import { makeCompleteBooking } from "./completeBooking";

const booking = {
  userId: "user-1",
  roomId: "room-1",
  checkinDate: "2026-12-01",
  checkoutDate: "2026-12-04",
  numberOfDays: 3,
  adults: 2,
  children: 0,
  totalPrice: 285,
  discount: 5,
  currency: "EUR" as const,
  exchangeRate: 0.9,
  chargedAmount: 256.5,
};

const setup = () => {
  const payments = new FakePaymentGateway();
  const bookings = new InMemoryBookingRepository();
  const rooms = new InMemoryRoomRepository([buildRoom()]);
  const completeBooking = makeCompleteBooking({ payments, bookings, rooms });
  return { payments, bookings, rooms, completeBooking };
};

describe("checkout metadata", () => {
  it("round-trips a booking", () => {
    expect(fromCheckoutMetadata(toCheckoutMetadata(booking))).toEqual(booking);
  });

  it("reports missing fields with a translatable code", () => {
    expect(() => fromCheckoutMetadata({ user: "u" })).toThrow(ValidationError);
    expect(() => fromCheckoutMetadata({ user: "u" })).toThrowError(
      expect.objectContaining({ code: "checkoutMetadataInvalid" })
    );
  });

  it("reads sessions created before currencies existed as US dollars", () => {
    const { currency, exchangeRate, chargedAmount, ...legacy } = toCheckoutMetadata(booking);
    void currency;
    void exchangeRate;
    void chargedAmount;

    expect(fromCheckoutMetadata(legacy)).toMatchObject({
      currency: "USD",
      exchangeRate: 1,
      chargedAmount: 285,
    });
  });
});

describe("completeBooking", () => {
  it("creates the booking and marks the room as booked", async () => {
    const { payments, bookings, rooms, completeBooking } = setup();
    payments.completed = { metadata: toCheckoutMetadata(booking) };

    const result = await completeBooking("payload", "signature");

    expect(result).toEqual({ handled: true });
    expect(bookings.created).toEqual([booking]);
    expect(rooms.rooms[0].isBooked).toBe(true);
  });

  it("ignores events that are not completed checkouts", async () => {
    const { bookings, rooms, completeBooking } = setup();

    const result = await completeBooking("payload", "signature");

    expect(result).toEqual({ handled: false });
    expect(bookings.created).toHaveLength(0);
    expect(rooms.rooms[0].isBooked).toBe(false);
  });
});

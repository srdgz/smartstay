import { beforeEach, describe, expect, it } from "vitest";

import { ConflictError, NotFoundError, ValidationError } from "@/domain/errors";
import {
  buildRoom,
  FakeExchangeRateProvider,
  FakePaymentGateway,
  InMemoryRoomRepository,
} from "@/test/fakes";

import { fromCheckoutMetadata } from "./checkoutMetadata";
import { makeStartCheckout, type StartCheckoutInput } from "./startCheckout";

const NOW = new Date("2026-10-22T10:00:00Z");

const validInput: StartCheckoutInput = {
  userId: "user-1",
  roomSlug: "standard-room",
  checkinDate: "2026-12-01",
  checkoutDate: "2026-12-04",
  adults: 2,
  children: 1,
  currency: "USD",
  locale: "en",
  successUrl: "http://localhost:3000/en/users/user-1",
};

describe("startCheckout", () => {
  let rooms: InMemoryRoomRepository;
  let payments: FakePaymentGateway;
  let startCheckout: ReturnType<typeof makeStartCheckout>;

  beforeEach(() => {
    rooms = new InMemoryRoomRepository([buildRoom()]);
    payments = new FakePaymentGateway();
    startCheckout = makeStartCheckout({
      rooms,
      payments,
      rates: new FakeExchangeRateProvider(0.9),
      now: () => NOW,
    });
  });

  it("creates a checkout session priced on the server", async () => {
    const result = await startCheckout(validInput);

    expect(result).toEqual({
      sessionId: "cs_test_123",
      url: "https://checkout.stripe.test/cs_test_123",
    });
    expect(payments.requests).toHaveLength(1);

    const request = payments.requests[0];
    expect(request.productName).toBe("Standard Room");
    expect(request.unitAmount).toBe(28500);
    expect(request.currency).toBe("usd");
    expect(request.locale).toBe("en");
    expect(request.successUrl).toBe("http://localhost:3000/en/users/user-1");
    expect(request.productImages).toEqual(["https://images.example.com/1.jpg"]);
  });

  it("charges in the chosen currency using the current exchange rate", async () => {
    await startCheckout({ ...validInput, currency: "EUR", locale: "es" });

    const request = payments.requests[0];
    expect(request.currency).toBe("eur");
    expect(request.unitAmount).toBe(25650);
    expect(request.locale).toBe("es");
    expect(fromCheckoutMetadata(request.metadata)).toMatchObject({
      totalPrice: 285,
      currency: "EUR",
      exchangeRate: 0.9,
      chargedAmount: 256.5,
    });
  });

  it("stores the booking details in the checkout metadata", async () => {
    await startCheckout(validInput);

    expect(fromCheckoutMetadata(payments.requests[0].metadata)).toEqual({
      userId: "user-1",
      roomId: "room-1",
      checkinDate: "2026-12-01",
      checkoutDate: "2026-12-04",
      numberOfDays: 3,
      adults: 2,
      children: 1,
      totalPrice: 285,
      discount: 5,
      currency: "USD",
      exchangeRate: 1,
      chargedAmount: 285,
    });
  });

  it("looks the room up in the requested language", async () => {
    await startCheckout({ ...validInput, locale: "es" });
    expect(rooms.requestedLocales).toEqual(["es"]);
  });

  it("rejects unsupported currencies", async () => {
    await expect(startCheckout({ ...validInput, currency: "GBP" })).rejects.toMatchObject({
      code: "unsupportedCurrency",
    });
    expect(payments.requests).toHaveLength(0);
  });

  it("rejects invalid or inverted dates", async () => {
    await expect(startCheckout({ ...validInput, checkinDate: "soon" })).rejects.toMatchObject({
      code: "invalidDates",
    });
    await expect(
      startCheckout({ ...validInput, checkoutDate: "2026-12-01" })
    ).rejects.toMatchObject({ code: "checkoutAfterCheckin" });
  });

  it("rejects stays that start in the past", async () => {
    await expect(
      startCheckout({ ...validInput, checkinDate: "2026-10-01", checkoutDate: "2026-10-05" })
    ).rejects.toMatchObject({ code: "checkinPast" });
  });

  it("rejects guest numbers outside the allowed range", async () => {
    await expect(startCheckout({ ...validInput, adults: 0 })).rejects.toMatchObject({
      code: "adultsRange",
      params: { min: 1, max: 5 },
    });
    await expect(startCheckout({ ...validInput, adults: 6 })).rejects.toThrow(/adults/);
    await expect(startCheckout({ ...validInput, children: 4 })).rejects.toMatchObject({
      code: "childrenRange",
      params: { min: 0, max: 3 },
    });
    await expect(startCheckout({ ...validInput, children: 1.5 })).rejects.toThrow(/children/);
    await expect(startCheckout({ ...validInput, adults: 0 })).rejects.toBeInstanceOf(
      ValidationError
    );
  });

  it("fails when the room does not exist", async () => {
    await expect(
      startCheckout({ ...validInput, roomSlug: "missing" })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("fails when the room is already booked", async () => {
    rooms.rooms = [buildRoom({ isBooked: true })];
    await expect(startCheckout(validInput)).rejects.toBeInstanceOf(ConflictError);
    expect(payments.requests).toHaveLength(0);
  });
});

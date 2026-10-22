import { beforeEach, describe, expect, it } from "vitest";

import { ConflictError, NotFoundError, ValidationError } from "@/domain/errors";
import {
  buildRoom,
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
  origin: "http://localhost:3000",
};

describe("startCheckout", () => {
  let rooms: InMemoryRoomRepository;
  let payments: FakePaymentGateway;
  let startCheckout: ReturnType<typeof makeStartCheckout>;

  beforeEach(() => {
    rooms = new InMemoryRoomRepository([buildRoom()]);
    payments = new FakePaymentGateway();
    startCheckout = makeStartCheckout({ rooms, payments, now: () => NOW });
  });

  it("creates a checkout session priced on the server", async () => {
    const result = await startCheckout(validInput);

    expect(result).toEqual({ sessionId: "cs_test_123" });
    expect(payments.requests).toHaveLength(1);

    const request = payments.requests[0];
    expect(request.productName).toBe("Standard Room");
    expect(request.unitAmount).toBe(28500);
    expect(request.currency).toBe("usd");
    expect(request.successUrl).toBe("http://localhost:3000/users/user-1");
    expect(request.productImages).toEqual(["https://images.example.com/1.jpg"]);
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
    });
  });

  it("rejects invalid or inverted dates", async () => {
    await expect(startCheckout({ ...validInput, checkinDate: "soon" })).rejects.toBeInstanceOf(
      ValidationError
    );
    await expect(
      startCheckout({ ...validInput, checkoutDate: "2026-12-01" })
    ).rejects.toThrow(/after the check-in/);
  });

  it("rejects stays that start in the past", async () => {
    await expect(
      startCheckout({ ...validInput, checkinDate: "2026-10-01", checkoutDate: "2026-10-05" })
    ).rejects.toThrow(/in the past/);
  });

  it("rejects guest numbers outside the allowed range", async () => {
    await expect(startCheckout({ ...validInput, adults: 0 })).rejects.toThrow(/adults/);
    await expect(startCheckout({ ...validInput, adults: 6 })).rejects.toThrow(/adults/);
    await expect(startCheckout({ ...validInput, children: 4 })).rejects.toThrow(/children/);
    await expect(startCheckout({ ...validInput, children: 1.5 })).rejects.toThrow(/children/);
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

import {
  MAX_ADULTS,
  MAX_CHILDREN,
  MIN_ADULTS,
  MIN_CHILDREN,
} from "@/domain/booking/limits";
import { ConflictError, NotFoundError, ValidationError } from "@/domain/errors";
import {
  nightsBetween,
  parseDateOnly,
  stayTotal,
  toMinorUnits,
} from "@/domain/room/pricing";
import type { RoomRepository } from "@/domain/room/RoomRepository";

import type { PaymentGateway } from "../ports/PaymentGateway";
import { toCheckoutMetadata } from "./checkoutMetadata";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export type StartCheckoutInput = {
  userId: string;
  roomSlug: string;
  checkinDate: string;
  checkoutDate: string;
  adults: number;
  children: number;
  origin: string;
};

type Dependencies = {
  rooms: RoomRepository;
  payments: PaymentGateway;
  now?: () => Date;
};

const isIntegerBetween = (value: number, min: number, max: number) =>
  Number.isInteger(value) && value >= min && value <= max;

export const makeStartCheckout =
  ({ rooms, payments, now = () => new Date() }: Dependencies) =>
  async (input: StartCheckoutInput) => {
    const { userId, roomSlug, checkinDate, checkoutDate, adults, children } = input;

    if (!roomSlug) throw new ValidationError("Please choose a room.");

    if (parseDateOnly(checkinDate) === null || parseDateOnly(checkoutDate) === null) {
      throw new ValidationError("Please provide valid check-in and check-out dates.");
    }

    const earliest = new Date(now().getTime() - DAY_IN_MS).toISOString().slice(0, 10);
    if (checkinDate < earliest) {
      throw new ValidationError("The check-in date cannot be in the past.");
    }

    const numberOfDays = nightsBetween(checkinDate, checkoutDate);
    if (numberOfDays < 1) {
      throw new ValidationError("The check-out date must be after the check-in date.");
    }

    if (!isIntegerBetween(adults, MIN_ADULTS, MAX_ADULTS)) {
      throw new ValidationError(
        `The number of adults must be between ${MIN_ADULTS} and ${MAX_ADULTS}.`
      );
    }

    if (!isIntegerBetween(children, MIN_CHILDREN, MAX_CHILDREN)) {
      throw new ValidationError(
        `The number of children must be between ${MIN_CHILDREN} and ${MAX_CHILDREN}.`
      );
    }

    const room = await rooms.findBySlug(roomSlug);
    if (!room) throw new NotFoundError("We could not find that room.");
    if (room.isBooked) throw new ConflictError("This room is already booked.");

    const totalPrice = stayTotal(room.price, room.discount, numberOfDays);

    const session = await payments.createCheckoutSession({
      productName: room.name,
      productImages: room.images.map((image) => image.url),
      unitAmount: toMinorUnits(totalPrice),
      currency: "usd",
      successUrl: `${input.origin}/users/${userId}`,
      metadata: toCheckoutMetadata({
        userId,
        roomId: room.id,
        checkinDate,
        checkoutDate,
        numberOfDays,
        adults,
        children,
        totalPrice,
        discount: room.discount,
      }),
    });

    return { sessionId: session.id };
  };

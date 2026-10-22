import { isRoomAvailable } from "@/domain/booking/availability";
import type { BookingRepository } from "@/domain/booking/BookingRepository";
import {
  MAX_ADULTS,
  MAX_CHILDREN,
  MIN_ADULTS,
  MIN_CHILDREN,
} from "@/domain/booking/limits";
import { assertValidStay } from "@/domain/booking/stay";
import { ConflictError, NotFoundError, ValidationError } from "@/domain/errors";
import { toContentLocale } from "@/domain/locale";
import { convertAmount, isCurrency, type Currency } from "@/domain/money/Currency";
import type { ExchangeRateProvider } from "@/domain/money/ExchangeRates";
import { stayTotal, toMinorUnits } from "@/domain/room/pricing";
import type { RoomRepository } from "@/domain/room/RoomRepository";

import type { PaymentGateway } from "../ports/PaymentGateway";
import { toCheckoutMetadata } from "./checkoutMetadata";

export type StartCheckoutInput = {
  userId: string;
  roomSlug: string;
  checkinDate: string;
  checkoutDate: string;
  adults: number;
  children: number;
  currency: string;
  locale: string;
  successUrl: string;
};

type Dependencies = {
  rooms: RoomRepository;
  bookings: BookingRepository;
  payments: PaymentGateway;
  rates: ExchangeRateProvider;
  now?: () => Date;
};

const isIntegerBetween = (value: number, min: number, max: number) =>
  Number.isInteger(value) && value >= min && value <= max;

export const makeStartCheckout =
  ({ rooms, bookings, payments, rates, now = () => new Date() }: Dependencies) =>
  async (input: StartCheckoutInput) => {
    const { userId, roomSlug, checkinDate, checkoutDate, adults, children } = input;

    if (!roomSlug) throw new ValidationError("Please choose a room.", "roomRequired");

    if (!isCurrency(input.currency)) {
      throw new ValidationError("That currency is not supported.", "unsupportedCurrency");
    }
    const currency: Currency = input.currency;

    const numberOfDays = assertValidStay(checkinDate, checkoutDate, now());

    if (!isIntegerBetween(adults, MIN_ADULTS, MAX_ADULTS)) {
      throw new ValidationError(
        `The number of adults must be between ${MIN_ADULTS} and ${MAX_ADULTS}.`,
        "adultsRange",
        { min: MIN_ADULTS, max: MAX_ADULTS }
      );
    }

    if (!isIntegerBetween(children, MIN_CHILDREN, MAX_CHILDREN)) {
      throw new ValidationError(
        `The number of children must be between ${MIN_CHILDREN} and ${MAX_CHILDREN}.`,
        "childrenRange",
        { min: MIN_CHILDREN, max: MAX_CHILDREN }
      );
    }

    const room = await rooms.findBySlug(roomSlug, toContentLocale(input.locale));
    if (!room) throw new NotFoundError("We could not find that room.", "roomNotFound");
    const bookedRanges = await bookings.findBookedRanges(checkinDate);
    if (!isRoomAvailable(room.id, { checkinDate, checkoutDate }, bookedRanges)) {
      throw new ConflictError("This room is not available on those dates.", "roomUnavailable");
    }

    const totalPrice = stayTotal(room.price, room.discount, numberOfDays);
    const { rates: exchangeRates } = await rates.getRates();
    const exchangeRate = exchangeRates[currency];
    const chargedAmount = convertAmount(totalPrice, exchangeRate);

    const session = await payments.createCheckoutSession({
      productName: room.name,
      productImages: room.images.map((image) => image.url),
      unitAmount: toMinorUnits(chargedAmount),
      currency: currency.toLowerCase(),
      locale: input.locale,
      successUrl: input.successUrl,
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
        currency,
        exchangeRate,
        chargedAmount: toMinorUnits(chargedAmount) / 100,
      }),
    });

    return { sessionId: session.id, url: session.url };
  };

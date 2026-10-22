import type { NewBooking } from "@/domain/booking/Booking";
import { ValidationError } from "@/domain/errors";
import { BASE_CURRENCY, isCurrency } from "@/domain/money/Currency";

export const toCheckoutMetadata = (booking: NewBooking): Record<string, string> => ({
  adults: String(booking.adults),
  checkinDate: booking.checkinDate,
  checkoutDate: booking.checkoutDate,
  children: String(booking.children),
  hotelRoom: booking.roomId,
  numberOfDays: String(booking.numberOfDays),
  user: booking.userId,
  discount: String(booking.discount),
  totalPrice: String(booking.totalPrice),
  currency: booking.currency,
  exchangeRate: String(booking.exchangeRate),
  chargedAmount: String(booking.chargedAmount),
});

export const fromCheckoutMetadata = (
  metadata: Record<string, string>
): NewBooking => {
  const required = [
    "adults",
    "checkinDate",
    "checkoutDate",
    "children",
    "hotelRoom",
    "numberOfDays",
    "user",
    "discount",
    "totalPrice",
  ];
  const missing = required.filter((key) => metadata[key] === undefined);
  if (missing.length) {
    throw new ValidationError(
      `Checkout metadata is missing: ${missing.join(", ")}`,
      "checkoutMetadataInvalid"
    );
  }

  const totalPrice = Number(metadata.totalPrice);
  const currency = isCurrency(metadata.currency) ? metadata.currency : BASE_CURRENCY;

  return {
    userId: metadata.user,
    roomId: metadata.hotelRoom,
    checkinDate: metadata.checkinDate,
    checkoutDate: metadata.checkoutDate,
    numberOfDays: Number(metadata.numberOfDays),
    adults: Number(metadata.adults),
    children: Number(metadata.children),
    totalPrice,
    discount: Number(metadata.discount),
    currency,
    exchangeRate: metadata.exchangeRate ? Number(metadata.exchangeRate) : 1,
    chargedAmount: metadata.chargedAmount ? Number(metadata.chargedAmount) : totalPrice,
  };
};

import type { NewBooking } from "@/domain/booking/Booking";
import { ValidationError } from "@/domain/errors";

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
    throw new ValidationError(`Checkout metadata is missing: ${missing.join(", ")}`);
  }

  return {
    userId: metadata.user,
    roomId: metadata.hotelRoom,
    checkinDate: metadata.checkinDate,
    checkoutDate: metadata.checkoutDate,
    numberOfDays: Number(metadata.numberOfDays),
    adults: Number(metadata.adults),
    children: Number(metadata.children),
    totalPrice: Number(metadata.totalPrice),
    discount: Number(metadata.discount),
  };
};

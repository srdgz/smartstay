import { ValidationError } from "../errors";
import { nightsBetween, parseDateOnly } from "../room/pricing";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const assertValidStay = (checkinDate: string, checkoutDate: string, now: Date) => {
  if (parseDateOnly(checkinDate) === null || parseDateOnly(checkoutDate) === null) {
    throw new ValidationError(
      "Please provide valid check-in and check-out dates.",
      "invalidDates"
    );
  }

  const earliest = new Date(now.getTime() - DAY_IN_MS).toISOString().slice(0, 10);
  if (checkinDate < earliest) {
    throw new ValidationError("The check-in date cannot be in the past.", "checkinPast");
  }

  const numberOfDays = nightsBetween(checkinDate, checkoutDate);
  if (numberOfDays < 1) {
    throw new ValidationError(
      "The check-out date must be after the check-in date.",
      "checkoutAfterCheckin"
    );
  }

  return numberOfDays;
};

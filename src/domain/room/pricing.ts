const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

export const parseDateOnly = (value: string): number | null => {
  const match = DATE_ONLY.exec(value);
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  const time = Date.UTC(year, month - 1, day);
  const date = new Date(time);
  const isSameDay =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
  return isSameDay ? time : null;
};

export const nightsBetween = (checkinDate: string, checkoutDate: string) => {
  const checkin = parseDateOnly(checkinDate);
  const checkout = parseDateOnly(checkoutDate);
  if (checkin === null || checkout === null) return 0;
  return Math.max(0, Math.round((checkout - checkin) / DAY_IN_MS));
};

export const discountedPrice = (price: number, discount: number) =>
  price - (price / 100) * discount;

export const stayTotal = (price: number, discount: number, nights: number) =>
  discountedPrice(price, discount) * nights;

export const toMinorUnits = (amount: number) => Math.round(amount * 100);

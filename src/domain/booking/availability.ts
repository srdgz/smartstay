export type BookedRange = {
  roomId: string;
  checkinDate: string;
  checkoutDate: string;
};

export type DateRange = Pick<BookedRange, "checkinDate" | "checkoutDate">;

export const rangesOverlap = (a: DateRange, b: DateRange) =>
  a.checkinDate < b.checkoutDate && b.checkinDate < a.checkoutDate;

export const isRoomAvailable = (
  roomId: string,
  stay: DateRange,
  booked: BookedRange[]
) => !booked.some((range) => range.roomId === roomId && rangesOverlap(stay, range));

export const nextBookedCheckin = (ranges: DateRange[], from: string) =>
  ranges
    .map((range) => range.checkinDate)
    .filter((checkinDate) => checkinDate >= from)
    .sort()[0] ?? null;

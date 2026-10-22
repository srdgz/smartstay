import { describe, expect, it } from "vitest";

import {
  isRoomAvailable,
  nextBookedCheckin,
  rangesOverlap,
  type BookedRange,
} from "./availability";

const stay = (checkinDate: string, checkoutDate: string) => ({ checkinDate, checkoutDate });

describe("rangesOverlap", () => {
  const booked = stay("2030-05-10", "2030-05-15");

  it("detects stays that share a night", () => {
    expect(rangesOverlap(stay("2030-05-12", "2030-05-14"), booked)).toBe(true);
    expect(rangesOverlap(stay("2030-05-08", "2030-05-11"), booked)).toBe(true);
    expect(rangesOverlap(stay("2030-05-14", "2030-05-20"), booked)).toBe(true);
    expect(rangesOverlap(stay("2030-05-01", "2030-05-30"), booked)).toBe(true);
  });

  it("allows a stay to start on the day another one ends", () => {
    expect(rangesOverlap(stay("2030-05-15", "2030-05-18"), booked)).toBe(false);
  });

  it("allows a stay to end on the day another one starts", () => {
    expect(rangesOverlap(stay("2030-05-05", "2030-05-10"), booked)).toBe(false);
  });

  it("ignores distant stays", () => {
    expect(rangesOverlap(stay("2030-06-01", "2030-06-05"), booked)).toBe(false);
  });
});

describe("isRoomAvailable", () => {
  const booked: BookedRange[] = [
    { roomId: "room-1", checkinDate: "2030-05-10", checkoutDate: "2030-05-15" },
  ];

  it("is unavailable when the same room is booked in the period", () => {
    expect(isRoomAvailable("room-1", stay("2030-05-12", "2030-05-13"), booked)).toBe(false);
  });

  it("ignores bookings of other rooms", () => {
    expect(isRoomAvailable("room-2", stay("2030-05-12", "2030-05-13"), booked)).toBe(true);
  });

  it("is available outside the booked period", () => {
    expect(isRoomAvailable("room-1", stay("2030-05-15", "2030-05-17"), booked)).toBe(true);
  });
});

describe("nextBookedCheckin", () => {
  const ranges = [stay("2030-07-01", "2030-07-05"), stay("2030-05-10", "2030-05-15")];

  it("returns the closest check-in on or after the given date", () => {
    expect(nextBookedCheckin(ranges, "2030-05-01")).toBe("2030-05-10");
    expect(nextBookedCheckin(ranges, "2030-05-16")).toBe("2030-07-01");
  });

  it("returns null when nothing follows", () => {
    expect(nextBookedCheckin(ranges, "2030-08-01")).toBeNull();
  });
});

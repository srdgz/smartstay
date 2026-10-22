import { describe, expect, it } from "vitest";

import { NotFoundError } from "@/domain/errors";
import { buildRoom, InMemoryBookingRepository, InMemoryRoomRepository } from "@/test/fakes";

import { makeGetRoomAvailability } from "./getRoomAvailability";

const setup = () => {
  const rooms = new InMemoryRoomRepository([buildRoom({ id: "room-1", slug: "one" })]);
  const bookings = new InMemoryBookingRepository();
  bookings.booked = [
    { roomId: "room-1", checkinDate: "2026-12-01", checkoutDate: "2026-12-05" },
    { roomId: "room-2", checkinDate: "2026-12-10", checkoutDate: "2026-12-12" },
    { roomId: "room-1", checkinDate: "2026-09-01", checkoutDate: "2026-09-03" },
  ];
  return makeGetRoomAvailability({ rooms, bookings, now: () => new Date("2026-10-22T10:00:00Z") });
};

describe("getRoomAvailability", () => {
  it("lists the upcoming booked ranges of the room only", async () => {
    expect(await setup()("one")).toEqual({
      booked: [{ checkinDate: "2026-12-01", checkoutDate: "2026-12-05" }],
    });
  });

  it("fails for an unknown room", async () => {
    await expect(setup()("missing")).rejects.toBeInstanceOf(NotFoundError);
  });
});

import { beforeEach, describe, expect, it } from "vitest";

import { ValidationError } from "@/domain/errors";
import { buildRoom, InMemoryBookingRepository, InMemoryRoomRepository } from "@/test/fakes";

import { makeGetRooms } from "./getRooms";

const NOW = new Date("2026-10-22T10:00:00Z");

describe("getRooms", () => {
  let bookings: InMemoryBookingRepository;
  let getRooms: ReturnType<typeof makeGetRooms>;

  beforeEach(() => {
    const rooms = new InMemoryRoomRepository([
      buildRoom({ id: "room-1", slug: "one" }),
      buildRoom({ id: "room-2", slug: "two" }),
    ]);
    bookings = new InMemoryBookingRepository();
    bookings.booked = [
      { roomId: "room-1", checkinDate: "2026-12-01", checkoutDate: "2026-12-05" },
    ];
    getRooms = makeGetRooms({ rooms, bookings, now: () => NOW });
  });

  it("returns every room when no dates are given", async () => {
    expect(await getRooms("en")).toHaveLength(2);
  });

  it("hides the rooms booked in the searched dates", async () => {
    const result = await getRooms("en", {
      checkinDate: "2026-12-03",
      checkoutDate: "2026-12-07",
    });

    expect(result.map((room) => room.slug)).toEqual(["two"]);
  });

  it("keeps a room whose booking ends on the check-in day", async () => {
    const result = await getRooms("en", {
      checkinDate: "2026-12-05",
      checkoutDate: "2026-12-07",
    });

    expect(result).toHaveLength(2);
  });

  it("requires both dates and a valid period", async () => {
    await expect(getRooms("en", { checkinDate: "2026-12-03" })).rejects.toBeInstanceOf(
      ValidationError
    );
    await expect(
      getRooms("en", { checkinDate: "2026-12-07", checkoutDate: "2026-12-03" })
    ).rejects.toMatchObject({ code: "checkoutAfterCheckin" });
  });
});

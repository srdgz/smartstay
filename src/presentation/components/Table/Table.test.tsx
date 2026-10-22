import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "@/test/axe";
import { describe, expect, it, vi } from "vitest";

import type { Booking } from "@/models/booking";

import Table from "./Table";

const bookings = [
  {
    _id: "b1",
    totalPrice: 190,
    discount: 5,
    numberOfDays: 2,
    hotelRoom: {
      _id: "r1",
      name: "Standard Room",
      price: 100,
      slug: { current: "standard-room" },
    },
  },
] as unknown as Booking[];

const setup = () => {
  const setRoomId = vi.fn();
  const toggleRatingModal = vi.fn();
  render(
    <Table
      bookingDetails={bookings}
      setRoomId={setRoomId}
      toggleRatingModal={toggleRatingModal}
    />
  );
  return { setRoomId, toggleRatingModal };
};

describe("Table", () => {
  it("is a captioned, keyboard-scrollable region", () => {
    setup();
    const region = screen.getByRole("region", { name: "Current bookings table" });
    expect(region).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("table", { name: "Current bookings" })).toBeInTheDocument();
  });

  it("links the room name to its page", () => {
    setup();
    expect(screen.getByRole("link", { name: "Standard Room" })).toHaveAttribute(
      "href",
      "/rooms/standard-room"
    );
  });

  it("opens the rating dialog for the chosen room", async () => {
    const { setRoomId, toggleRatingModal } = setup();
    await userEvent.setup().click(screen.getByRole("button", { name: "Rate Standard Room" }));
    expect(setRoomId).toHaveBeenCalledWith("r1");
    expect(toggleRatingModal).toHaveBeenCalledTimes(1);
  });

  it("has no accessibility violations", async () => {
    setup();
    expect(await axe(document.body)).toHaveNoViolations();
  });
});

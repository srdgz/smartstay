import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { describe, expect, it, vi } from "vitest";

import type { Booking } from "@/domain/booking/Booking";

import Table from "./Table";

const bookings: Booking[] = [
  {
    id: "b1",
    room: {
      id: "r1",
      slug: "standard-room",
      name: "Standard Room",
      price: 100,
    },
    checkinDate: "2026-12-01",
    checkoutDate: "2026-12-03",
    numberOfDays: 2,
    adults: 2,
    children: 0,
    totalPrice: 190,
    discount: 5,
    currency: "EUR",
    exchangeRate: 0.9,
    chargedAmount: 171,
  },
];

const setup = () => {
  const setRoomId = vi.fn();
  const toggleRatingModal = vi.fn();
  renderWithProviders(
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

  it("shows the check-in and check-out dates in the site language", () => {
    setup();
    expect(screen.getByRole("columnheader", { name: "Check In" })).toBeInTheDocument();
    expect(screen.getByText("Dec 1, 2026")).toHaveAttribute("datetime", "2026-12-01");
    expect(screen.getByText("Dec 3, 2026")).toHaveAttribute("datetime", "2026-12-03");
  });

  it("links the room name to its page", () => {
    setup();
    expect(screen.getByRole("link", { name: "Standard Room" })).toHaveAttribute(
      "href",
      "/en/rooms/standard-room"
    );
  });

  it("shows the amount in the currency the booking was charged in", () => {
    setup();
    expect(screen.getByText("€171")).toBeInTheDocument();
    expect(screen.queryByText("€90")).not.toBeInTheDocument();
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

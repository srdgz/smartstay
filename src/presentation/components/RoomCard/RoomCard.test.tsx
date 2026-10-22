import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { axe } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { buildRoom } from "@/test/fakes";

import RoomCard from "./RoomCard";

describe("RoomCard", () => {
  it("links the room name to its page", () => {
    renderWithProviders(<RoomCard room={buildRoom({ type: "luxury" })} />);

    expect(screen.getByRole("heading", { name: "Standard Room" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Standard Room" })).toHaveAttribute(
      "href",
      "/en/rooms/standard-room"
    );
  });

  it("shows the nightly price in the chosen currency", () => {
    renderWithProviders(<RoomCard room={buildRoom({ price: 100 })} />, { currency: "EUR" });
    expect(screen.getByText("€90")).toBeInTheDocument();
    expect(screen.getByText("/ night")).toBeInTheDocument();
  });

  it("translates the room type", () => {
    renderWithProviders(<RoomCard room={buildRoom({ type: "luxury" })} />, { locale: "es" });
    expect(screen.getByText("habitación de lujo")).toBeInTheDocument();
  });

  it("announces when the room is already booked", () => {
    renderWithProviders(<RoomCard room={buildRoom({ isBooked: true })} />);

    expect(screen.getByRole("link", { name: "Standard Room - BOOKED" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithProviders(<RoomCard room={buildRoom()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { axe } from "@/test/axe";
import { renderWithProviders } from "@/test/render";

import MobileBookBar from "./MobileBookBar";

describe("MobileBookBar", () => {
  it("shows the discounted nightly price and links to the booking form", () => {
    renderWithProviders(<MobileBookBar price={100} discount={5} />);

    expect(screen.getByText("$95")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Book Now" })).toHaveAttribute(
      "href",
      "#booking"
    );
  });

  it("uses the selected currency", () => {
    renderWithProviders(<MobileBookBar price={100} discount={0} />, {
      currency: "EUR",
    });
    expect(screen.getByText("€90")).toBeInTheDocument();
  });


  it("is translated on the Spanish site", () => {
    renderWithProviders(<MobileBookBar price={100} discount={0} />, {
      locale: "es",
    });
    expect(screen.getByRole("link", { name: "Reservar ahora" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithProviders(
      <MobileBookBar price={100} discount={5} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

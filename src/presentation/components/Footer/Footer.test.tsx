import { screen, within } from "@testing-library/react";
import { axe } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { describe, expect, it } from "vitest";

import Footer from "./Footer";

describe("Footer", () => {
  it("exposes two named navigation landmarks", () => {
    renderWithProviders(<Footer />);
    expect(screen.getByRole("navigation", { name: "Support" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Explore" })).toBeInTheDocument();
  });

  it("links only to pages that exist", () => {
    renderWithProviders(<Footer />);
    const support = screen.getByRole("navigation", { name: "Support" });
    const explore = screen.getByRole("navigation", { name: "Explore" });

    expect(within(support).getByRole("link", { name: "Help Center" })).toHaveAttribute(
      "href",
      "/en/contact"
    );
    expect(within(explore).getByRole("link", { name: "Stays" })).toHaveAttribute(
      "href",
      "/en/rooms"
    );
    expect(within(support).getAllByRole("link")).toHaveLength(1);
    expect(within(explore).getAllByRole("link")).toHaveLength(1);
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithProviders(<Footer />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

import { render, screen, within } from "@testing-library/react";
import { axe } from "@/test/axe";
import { describe, expect, it } from "vitest";

import Footer from "./Footer";

describe("Footer", () => {
  it("exposes two named navigation landmarks", () => {
    render(<Footer />);
    expect(screen.getByRole("navigation", { name: "Support" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Explore" })).toBeInTheDocument();
  });

  it("links only to pages that exist", () => {
    render(<Footer />);
    const support = screen.getByRole("navigation", { name: "Support" });
    const explore = screen.getByRole("navigation", { name: "Explore" });

    expect(within(support).getByRole("link", { name: "Help Center" })).toHaveAttribute(
      "href",
      "/contact"
    );
    expect(within(explore).getByRole("link", { name: "Stays" })).toHaveAttribute(
      "href",
      "/rooms"
    );
    expect(within(support).getAllByRole("link")).toHaveLength(1);
    expect(within(explore).getAllByRole("link")).toHaveLength(1);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Footer />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

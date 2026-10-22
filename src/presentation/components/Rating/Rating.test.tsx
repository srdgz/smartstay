import { screen } from "@testing-library/react";
import { axe } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { describe, expect, it } from "vitest";

import Rating from "./Rating";

describe("Rating", () => {
  it("exposes the rating as text for assistive technology", () => {
    renderWithProviders(<Rating rating={4.5} />);
    expect(screen.getByRole("img", { name: "Rated 4.5 out of 5" })).toBeInTheDocument();
  });

  it("renders a star per whole point and a half star for decimals", () => {
    const { container } = renderWithProviders(<Rating rating={3.5} />);
    expect(container.querySelectorAll("svg")).toHaveLength(4);
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithProviders(<Rating rating={5} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

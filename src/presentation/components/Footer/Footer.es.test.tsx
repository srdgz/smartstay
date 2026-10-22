import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { axe } from "@/test/axe";
import { renderWithProviders } from "@/test/render";

import Footer from "./Footer";

describe("Footer in Spanish", () => {
  it("translates the landmarks and links", () => {
    renderWithProviders(<Footer />, { locale: "es" });

    const support = screen.getByRole("navigation", { name: "Ayuda" });
    expect(within(support).getByRole("link", { name: "Centro de ayuda" })).toHaveAttribute(
      "href",
      "/es/contact"
    );

    const explore = screen.getByRole("navigation", { name: "Explorar" });
    expect(within(explore).getByRole("link", { name: "Alojamientos" })).toHaveAttribute(
      "href",
      "/es/rooms"
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithProviders(<Footer />, { locale: "es" });
    expect(await axe(container)).toHaveNoViolations();
  });
});

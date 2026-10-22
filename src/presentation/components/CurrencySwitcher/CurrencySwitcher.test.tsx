import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { axe } from "@/test/axe";
import { renderWithProviders } from "@/test/render";

import Money from "../Money/Money";
import CurrencySwitcher from "./CurrencySwitcher";

describe("CurrencySwitcher", () => {
  it("is a labelled select with the active currency selected", () => {
    renderWithProviders(<CurrencySwitcher />, { currency: "EUR" });
    expect(screen.getByLabelText("Currency")).toHaveValue("EUR");
  });

  it("updates prices everywhere and remembers the choice in a cookie", async () => {
    renderWithProviders(
      <>
        <CurrencySwitcher />
        <p data-testid="price">
          <Money amount={100} />
        </p>
      </>
    );
    expect(screen.getByTestId("price")).toHaveTextContent("$100");

    await userEvent.setup().selectOptions(screen.getByLabelText("Currency"), "EUR");

    expect(screen.getByTestId("price")).toHaveTextContent("€90");
    expect(document.cookie).toContain("NEXT_CURRENCY=EUR");
  });

  it("is translated on the Spanish site", () => {
    renderWithProviders(<CurrencySwitcher />, { locale: "es" });
    expect(screen.getByLabelText("Moneda")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithProviders(<CurrencySwitcher />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

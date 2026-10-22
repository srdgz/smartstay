import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test/render";

import Money from "./Money";

const plain = (value: string | null) => (value ?? "").replace(/ /g, " ");

describe("Money", () => {
  it("shows the base amount in dollars by default", () => {
    renderWithProviders(
      <p data-testid="price">
        <Money amount={285} />
      </p>
    );
    expect(screen.getByTestId("price")).toHaveTextContent("$285");
  });

  it("converts the base amount with the exchange rate for euros", () => {
    renderWithProviders(
      <p data-testid="price">
        <Money amount={285} />
      </p>,
      { currency: "EUR" }
    );
    expect(screen.getByTestId("price")).toHaveTextContent("€256.50");
  });

  it("uses Spanish number formatting on the Spanish site", () => {
    renderWithProviders(
      <p data-testid="price">
        <Money amount={285} />
      </p>,
      { locale: "es", currency: "EUR" }
    );
    expect(plain(screen.getByTestId("price").textContent)).toBe("256,50 €");
  });
});

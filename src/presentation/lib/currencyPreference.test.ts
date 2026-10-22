import { describe, expect, it } from "vitest";

import { currencyCookie, defaultCurrencyFor, resolveCurrency } from "./currencyPreference";

describe("currency preference", () => {
  it("defaults to euros for Spanish and dollars otherwise", () => {
    expect(defaultCurrencyFor("es")).toBe("EUR");
    expect(defaultCurrencyFor("en")).toBe("USD");
  });

  it("prefers a stored supported currency over the locale default", () => {
    expect(resolveCurrency("USD", "es")).toBe("USD");
    expect(resolveCurrency("EUR", "en")).toBe("EUR");
  });

  it("ignores missing or unsupported stored values", () => {
    expect(resolveCurrency(undefined, "es")).toBe("EUR");
    expect(resolveCurrency("GBP", "en")).toBe("USD");
  });

  it("builds a one year cookie that is valid across the whole site", () => {
    expect(currencyCookie("EUR")).toBe(
      "NEXT_CURRENCY=EUR; path=/; max-age=31536000; samesite=lax"
    );
  });
});

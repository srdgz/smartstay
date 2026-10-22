import { describe, expect, it } from "vitest";

import { convertAmount, isCurrency } from "./Currency";

describe("isCurrency", () => {
  it("accepts the supported currencies only", () => {
    expect(isCurrency("USD")).toBe(true);
    expect(isCurrency("EUR")).toBe(true);
    expect(isCurrency("GBP")).toBe(false);
    expect(isCurrency("usd")).toBe(false);
    expect(isCurrency(undefined)).toBe(false);
  });
});

describe("convertAmount", () => {
  it("multiplies the base amount by the rate", () => {
    expect(convertAmount(285, 0.92)).toBeCloseTo(262.2, 5);
    expect(convertAmount(285, 1)).toBe(285);
  });
});

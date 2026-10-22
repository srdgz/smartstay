import { describe, expect, it } from "vitest";

import { formatMoney } from "./formatMoney";

const plain = (value: string) => value.replace(/ /g, " ");

describe("formatMoney", () => {
  it("formats whole dollar amounts without decimals", () => {
    expect(formatMoney(285, "USD", "en")).toBe("$285");
  });

  it("keeps two decimals when the amount has cents", () => {
    expect(formatMoney(262.2, "EUR", "en")).toBe("€262.20");
    expect(plain(formatMoney(262.2, "EUR", "es"))).toBe("262,20 €");
  });

  it("rounds to cents before formatting", () => {
    expect(formatMoney(95.004, "USD", "en")).toBe("$95");
    expect(formatMoney(95.005, "USD", "en")).toBe("$95.01");
  });

  it("uses the symbol and separators of the locale", () => {
    expect(plain(formatMoney(1234.5, "EUR", "es"))).toBe("1234,50 €");
    expect(formatMoney(1234.5, "USD", "en")).toBe("$1,234.50");
  });
});

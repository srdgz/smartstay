import { describe, expect, it } from "vitest";

import {
  discountedPrice,
  nightsBetween,
  parseDateOnly,
  stayTotal,
  toMinorUnits,
} from "./pricing";

describe("parseDateOnly", () => {
  it("accepts real calendar dates", () => {
    expect(parseDateOnly("2026-12-01")).toBe(Date.UTC(2026, 11, 1));
  });

  it.each(["2026-13-01", "2026-02-30", "01/12/2026", "2026-12-01T10:00:00Z", ""])(
    "rejects %s",
    (value) => {
      expect(parseDateOnly(value)).toBeNull();
    }
  );
});

describe("nightsBetween", () => {
  it("counts the nights of a stay", () => {
    expect(nightsBetween("2026-12-01", "2026-12-04")).toBe(3);
  });

  it("is not affected by daylight saving changes", () => {
    expect(nightsBetween("2026-10-24", "2026-10-26")).toBe(2);
    expect(nightsBetween("2026-03-28", "2026-03-30")).toBe(2);
  });

  it("returns zero for equal, reversed or invalid dates", () => {
    expect(nightsBetween("2026-12-01", "2026-12-01")).toBe(0);
    expect(nightsBetween("2026-12-04", "2026-12-01")).toBe(0);
    expect(nightsBetween("nope", "2026-12-01")).toBe(0);
  });
});

describe("pricing", () => {
  it("applies the discount percentage", () => {
    expect(discountedPrice(100, 5)).toBe(95);
    expect(discountedPrice(200, 0)).toBe(200);
  });

  it("multiplies the discounted price by the nights", () => {
    expect(stayTotal(100, 5, 3)).toBe(285);
  });

  it("converts amounts to minor units without float drift", () => {
    expect(toMinorUnits(285)).toBe(28500);
    expect(toMinorUnits(0.1 + 0.2)).toBe(30);
    expect(toMinorUnits(19.99)).toBe(1999);
  });
});

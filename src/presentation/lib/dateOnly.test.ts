import { describe, expect, it } from "vitest";

import { toDateOnly } from "./dateOnly";

describe("toDateOnly", () => {
  it("uses the local calendar day instead of the UTC day", () => {
    expect(toDateOnly(new Date(2026, 11, 1, 0, 0, 0))).toBe("2026-12-01");
    expect(toDateOnly(new Date(2026, 11, 1, 23, 59, 59))).toBe("2026-12-01");
  });

  it("pads months and days", () => {
    expect(toDateOnly(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

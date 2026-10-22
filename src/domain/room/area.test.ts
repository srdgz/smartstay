import { describe, expect, it } from "vitest";

import { parseSquareFeet, squareFeetToSquareMeters } from "./area";

describe("squareFeetToSquareMeters", () => {
  it.each([
    [115, 11],
    [250, 23],
    [400, 37],
    [600, 56],
  ])("converts %i sq ft to %i m²", (squareFeet, squareMeters) => {
    expect(squareFeetToSquareMeters(squareFeet)).toBe(squareMeters);
  });
});

describe("parseSquareFeet", () => {
  it("reads the leading number", () => {
    expect(parseSquareFeet("250 sq ft")).toBe(250);
    expect(parseSquareFeet(" 115")).toBe(115);
  });

  it("returns null when there is no number", () => {
    expect(parseSquareFeet("")).toBeNull();
    expect(parseSquareFeet("large")).toBeNull();
  });
});

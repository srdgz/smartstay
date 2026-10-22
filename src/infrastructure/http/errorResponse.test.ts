import { describe, expect, it } from "vitest";

import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/domain/errors";

import { bodyFor, messageFor, statusFor } from "./errorResponse";

describe("errorResponse", () => {
  it.each([
    [new ValidationError("bad"), 400],
    [new UnauthorizedError("no"), 401],
    [new NotFoundError("gone"), 404],
    [new ConflictError("taken"), 409],
    [new Error("boom"), 500],
    ["text", 500],
  ])("maps %s to HTTP %i", (error, status) => {
    expect(statusFor(error)).toBe(status);
  });

  it("exposes the code and parameters of domain errors for translation", () => {
    expect(
      bodyFor(new ValidationError("Adults out of range.", "adultsRange", { min: 1, max: 5 }))
    ).toEqual({
      code: "adultsRange",
      message: "Adults out of range.",
      params: { min: 1, max: 5 },
    });
  });

  it("reports unexpected errors with the generic code only", () => {
    expect(bodyFor(new Error("secret stack detail"))).toEqual({
      code: "generic",
      message: "Something went wrong. Please try again.",
      params: {},
    });
  });

  it("shows domain messages but hides unexpected ones", () => {
    expect(messageFor(new ValidationError("Please pick a date."))).toBe("Please pick a date.");
    expect(messageFor(new Error("secret stack detail"))).toBe(
      "Something went wrong. Please try again."
    );
  });
});

import { describe, expect, it } from "vitest";

import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/domain/errors";

import { messageFor, statusFor } from "./errorResponse";

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

  it("shows domain messages but hides unexpected ones", () => {
    expect(messageFor(new ValidationError("Please pick a date."))).toBe("Please pick a date.");
    expect(messageFor(new Error("secret stack detail"))).toBe(
      "Something went wrong. Please try again."
    );
  });
});

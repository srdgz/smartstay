import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";

import { getErrorMessage } from "./errorMessage";

const axiosError = (data?: unknown, withResponse = true) =>
  new AxiosError(
    "failed",
    "ERR_BAD_REQUEST",
    undefined,
    undefined,
    withResponse
      ? ({ data, status: 401, statusText: "", headers: {}, config: {} } as never)
      : undefined
  );

describe("getErrorMessage", () => {
  it("returns the message sent by the server", () => {
    expect(getErrorMessage(axiosError("You must be logged in."), "fallback")).toBe(
      "You must be logged in."
    );
  });

  it("reports a network problem when there is no response", () => {
    expect(getErrorMessage(axiosError(undefined, false), "fallback")).toMatch(
      /network error/i
    );
  });

  it("uses the fallback when the server sends no readable message", () => {
    expect(getErrorMessage(axiosError({ code: 1 }), "fallback")).toBe("fallback");
    expect(getErrorMessage(axiosError("   "), "fallback")).toBe("fallback");
  });

  it("uses the fallback for unknown errors", () => {
    expect(getErrorMessage(new Error("boom"), "fallback")).toBe("fallback");
    expect(getErrorMessage(undefined, "fallback")).toBe("fallback");
  });
});

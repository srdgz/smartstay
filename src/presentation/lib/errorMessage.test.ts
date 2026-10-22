import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";

import { getErrorMessage, type ErrorTranslations } from "./errorMessage";

const translations: ErrorTranslations = {
  has: (code) => ["unauthorized", "adultsRange"].includes(code),
  message: (code, params) =>
    code === "adultsRange" ? `between ${params?.min} and ${params?.max}` : "Log in first.",
  network: "No connection.",
};

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
  it("translates the error code sent by the server", () => {
    expect(
      getErrorMessage(axiosError({ code: "unauthorized" }), "fallback", translations)
    ).toBe("Log in first.");
  });

  it("passes the error parameters to the translation", () => {
    expect(
      getErrorMessage(
        axiosError({ code: "adultsRange", params: { min: 1, max: 5 } }),
        "fallback",
        translations
      )
    ).toBe("between 1 and 5");
  });

  it("reports a network problem when there is no response", () => {
    expect(getErrorMessage(axiosError(undefined, false), "fallback", translations)).toBe(
      "No connection."
    );
  });

  it("uses the fallback for unknown codes or unreadable bodies", () => {
    expect(getErrorMessage(axiosError({ code: "mystery" }), "fallback", translations)).toBe(
      "fallback"
    );
    expect(getErrorMessage(axiosError("plain text"), "fallback", translations)).toBe(
      "fallback"
    );
    expect(getErrorMessage(axiosError(null), "fallback", translations)).toBe("fallback");
  });

  it("uses the fallback for errors that did not come from the API", () => {
    expect(getErrorMessage(new Error("boom"), "fallback", translations)).toBe("fallback");
    expect(getErrorMessage(undefined, "fallback", translations)).toBe("fallback");
  });
});

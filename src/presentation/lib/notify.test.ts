import toast from "react-hot-toast";
import { describe, expect, it, vi } from "vitest";

import { notifyError } from "./notify";

vi.mock("react-hot-toast", () => ({
  default: { error: vi.fn() },
}));

describe("notifyError", () => {
  it("announces errors assertively and keeps them on screen longer", () => {
    notifyError("Payment failed");

    expect(toast.error).toHaveBeenCalledWith("Payment failed", {
      id: undefined,
      duration: 8000,
      ariaProps: { role: "alert", "aria-live": "assertive" },
    });
  });

  it("deduplicates repeated errors by id", () => {
    notifyError("Sign in failed", "OAuthSignin");

    expect(toast.error).toHaveBeenCalledWith(
      "Sign in failed",
      expect.objectContaining({ id: "OAuthSignin" })
    );
  });
});

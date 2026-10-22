import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CountUpNumber from "./CountUpNumber";

const mockMatchMedia = (matches: boolean) =>
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  );

describe("CountUpNumber", () => {
  it("shows the final value immediately when reduced motion is requested", () => {
    mockMatchMedia(true);
    render(<CountUpNumber endValue={200} duration={3000} />);
    expect(screen.getByText("200")).toBeInTheDocument();
  });

  it("starts from zero when animation is allowed", () => {
    mockMatchMedia(false);
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    render(<CountUpNumber endValue={200} duration={3000} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

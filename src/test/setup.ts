import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { toHaveNoViolations } from "jest-axe";
import { afterEach, expect } from "vitest";

expect.extend(toHaveNoViolations);

afterEach(() => {
  if (typeof document === "undefined") return;

  cleanup();
  localStorage.clear();
  document.documentElement.className = "";
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ThemeProvider from "./ThemeProvider";

describe("ThemeProvider", () => {
  it("renders its children", async () => {
    render(
      <ThemeProvider>
        <p>content</p>
      </ThemeProvider>
    );
    expect(await screen.findByText("content")).toBeInTheDocument();
  });

  it("keeps the document in light mode by default", async () => {
    render(
      <ThemeProvider>
        <p>content</p>
      </ThemeProvider>
    );
    await screen.findByText("content");
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("applies the saved dark theme to the document element", async () => {
    localStorage.setItem("hotel-theme", "true");
    render(
      <ThemeProvider>
        <p>content</p>
      </ThemeProvider>
    );
    await screen.findByText("content");
    expect(document.documentElement).toHaveClass("dark");
  });
});

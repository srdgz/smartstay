import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SessionProvider } from "next-auth/react";
import { describe, expect, it, vi } from "vitest";

import ThemeContext from "@/presentation/context/themeContext";
import { axe } from "@/test/axe";
import { renderWithProviders } from "@/test/render";

import Header from "./Header";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={`/en${href === "/" ? "" : href}`} {...rest}>
      {children}
    </a>
  ),
  usePathname: () => "/rooms",
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

const setup = () =>
  renderWithProviders(
    <SessionProvider session={null}>
      <ThemeContext.Provider value={{ darkTheme: false, setDarkTheme: vi.fn() }}>
        <Header />
      </ThemeContext.Provider>
    </SessionProvider>
  );

describe("Header", () => {
  it("shows the main navigation and marks the current page", () => {
    setup();
    const nav = screen.getByRole("navigation", { name: "Main" });

    expect(within(nav).getByRole("link", { name: "Stays" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(within(nav).getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current"
    );
  });

  it("offers sign in when nobody is logged in", () => {
    setup();
    expect(screen.getAllByRole("link", { name: "Sign in" })[0]).toHaveAttribute(
      "href",
      "/en/auth"
    );
  });

  it("opens and closes the mobile menu with the button and Escape", async () => {
    const user = userEvent.setup();
    setup();
    const toggle = screen.getByRole("button", { name: "Open menu" });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-menu")).toBeNull();

    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(document.getElementById("mobile-menu")).not.toBeNull();

    await user.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(document.getElementById("mobile-menu")).toBeNull();
  });

  it("reports the dark mode toggle as a pressed button", () => {
    setup();
    expect(screen.getAllByRole("button", { name: "Dark mode" })[0]).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = setup();
    expect(await axe(container)).toHaveNoViolations();
  });
});

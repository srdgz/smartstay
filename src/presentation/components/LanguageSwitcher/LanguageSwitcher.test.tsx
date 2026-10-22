import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { axe } from "@/test/axe";
import { renderWithProviders } from "@/test/render";

import LanguageSwitcher from "./LanguageSwitcher";

const replace = vi.fn();

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/rooms",
}));

afterEach(() => {
  window.history.replaceState({}, "", "/");
});

describe("LanguageSwitcher", () => {
  it("is a labelled select showing the current language", () => {
    renderWithProviders(<LanguageSwitcher />);
    expect(screen.getByLabelText("Language")).toHaveValue("en");
  });

  it("switches language keeping the page and its query string", async () => {
    window.history.replaceState({}, "", "/en/rooms?roomType=Suite");
    renderWithProviders(<LanguageSwitcher />);

    await userEvent.setup().selectOptions(screen.getByLabelText("Language"), "es");

    expect(replace).toHaveBeenCalledWith("/rooms?roomType=Suite", { locale: "es" });
  });

  it("is translated on the Spanish site", () => {
    renderWithProviders(<LanguageSwitcher />, { locale: "es" });
    expect(screen.getByLabelText("Idioma")).toHaveValue("es");
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithProviders(<LanguageSwitcher />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

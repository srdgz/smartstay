import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { axe } from "@/test/axe";
import { renderWithProviders } from "@/test/render";

import PasswordField from "./PasswordField";

const setup = (locale: "en" | "es" = "en") => {
  const onChange = vi.fn();
  const view = renderWithProviders(
    <PasswordField
      id="password"
      name="password"
      label="Password"
      placeholder="Your password"
      value="secret123"
      onChange={onChange}
      autoComplete="current-password"
    />,
    { locale }
  );
  return { onChange, ...view };
};

describe("PasswordField", () => {
  it("hides the password by default", () => {
    setup();
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: "Show password" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("shows and hides the password with the toggle", async () => {
    setup();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("does not submit the form when toggled", () => {
    setup();
    expect(screen.getByRole("button", { name: "Show password" })).toHaveAttribute(
      "type",
      "button"
    );
  });

  it("reports typing", async () => {
    const { onChange } = setup();
    await userEvent.setup().type(screen.getByLabelText("Password"), "x");
    expect(onChange).toHaveBeenCalled();
  });

  it("is translated on the Spanish site", () => {
    setup("es");
    expect(screen.getByRole("button", { name: "Mostrar contraseña" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = setup();
    expect(await axe(container)).toHaveNoViolations();
  });
});

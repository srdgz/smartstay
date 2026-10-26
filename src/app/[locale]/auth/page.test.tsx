import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signUp } from "next-auth-sanity/client";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { notifyError } from "@/presentation/lib/notify";
import { axe } from "@/test/axe";
import { renderWithProviders } from "@/test/render";

import Auth from "./page";

const push = vi.fn();

vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  useSession: () => ({ data: null }),
}));
vi.mock("next-auth-sanity/client", () => ({ signUp: vi.fn() }));
vi.mock("@/presentation/lib/notify", () => ({ notifyError: vi.fn() }));
vi.mock("react-hot-toast", () => ({ default: { success: vi.fn() } }));

const setup = () => {
  const user = userEvent.setup();
  renderWithProviders(<Auth />);
  return user;
};

const goToSignUp = async (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole("button", { name: "Create an account" }));

describe("Auth page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(signIn).mockResolvedValue({ error: undefined, ok: true } as never);
    vi.mocked(signUp).mockResolvedValue({ _id: "user-1" } as never);
  });

  it("starts on the sign in form, without name or confirmation", () => {
    setup();

    expect(screen.getByRole("heading", { name: "Sign in to your account" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Confirm password")).not.toBeInTheDocument();
  });

  it("signs in with the credentials and goes home", async () => {
    const user = setup();

    await user.type(screen.getByLabelText("Email"), "ana@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() =>
      expect(signIn).toHaveBeenCalledWith("sanity-login", {
        redirect: false,
        email: "ana@example.com",
        password: "secret123",
      })
    );
    expect(push).toHaveBeenCalledWith("/");
  });

  it("tells the user when the credentials are wrong", async () => {
    vi.mocked(signIn).mockResolvedValue({ error: "CredentialsSignin" } as never);
    const user = setup();

    await user.type(screen.getByLabelText("Email"), "ana@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-pass");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() =>
      expect(notifyError).toHaveBeenCalledWith("Incorrect email or password.")
    );
    expect(push).not.toHaveBeenCalled();
  });

  it("offers a password toggle on sign in", () => {
    setup();
    expect(screen.getByRole("button", { name: "Show password" })).toBeInTheDocument();
  });

  it("switches to the sign up form with a confirmation field and two toggles", async () => {
    const user = setup();
    await goToSignUp(user);

    expect(screen.getByRole("heading", { name: "Create an account" })).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Show password" })).toHaveLength(2);
  });

  it("warns when the passwords do not match and blocks the submit", async () => {
    const user = setup();
    await goToSignUp(user);

    await user.type(screen.getByLabelText("Name"), "Ana");
    await user.type(screen.getByLabelText("Email"), "ana@example.com");
    await user.type(screen.getByLabelText("Password (at least 8 characters)"), "secret123");
    await user.type(screen.getByLabelText("Confirm password"), "secret124");

    expect(screen.getByRole("alert")).toHaveTextContent("The passwords do not match.");
    expect(screen.getByLabelText("Confirm password")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeDisabled();
    expect(signUp).not.toHaveBeenCalled();
  });

  it("creates the account without sending the confirmation and returns to sign in", async () => {
    const user = setup();
    await goToSignUp(user);

    await user.type(screen.getByLabelText("Name"), "Ana");
    await user.type(screen.getByLabelText("Email"), "ana@example.com");
    await user.type(screen.getByLabelText("Password (at least 8 characters)"), "secret123");
    await user.type(screen.getByLabelText("Confirm password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() =>
      expect(signUp).toHaveBeenCalledWith({
        name: "Ana",
        email: "ana@example.com",
        password: "secret123",
      })
    );
    expect(toast.success).toHaveBeenCalledWith("Account created. Please sign in.");
    expect(
      await screen.findByRole("heading", { name: "Sign in to your account" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveValue("ana@example.com");
  });

  it("shows an error when the account cannot be created", async () => {
    vi.mocked(signUp).mockRejectedValue(new Error("User already exist"));
    const user = setup();
    await goToSignUp(user);

    await user.type(screen.getByLabelText("Name"), "Ana");
    await user.type(screen.getByLabelText("Email"), "ana@example.com");
    await user.type(screen.getByLabelText("Password (at least 8 characters)"), "secret123");
    await user.type(screen.getByLabelText("Confirm password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => expect(notifyError).toHaveBeenCalled());
  });

  it("has no accessibility violations in either form", async () => {
    const user = setup();
    expect(await axe(document.body)).toHaveNoViolations();

    await goToSignUp(user);
    expect(await axe(document.body)).toHaveNoViolations();
  });
});

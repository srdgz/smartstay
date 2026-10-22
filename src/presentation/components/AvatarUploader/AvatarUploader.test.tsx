import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { removeAvatar, uploadAvatar } from "@/presentation/lib/apiClient";
import { notifyError } from "@/presentation/lib/notify";
import { axe } from "@/test/axe";
import { renderWithProviders } from "@/test/render";

import AvatarUploader from "./AvatarUploader";

vi.mock("@/presentation/lib/apiClient", () => ({
  uploadAvatar: vi.fn(),
  removeAvatar: vi.fn(),
}));
vi.mock("@/presentation/lib/notify", () => ({ notifyError: vi.fn() }));
vi.mock("react-hot-toast", () => ({ default: { success: vi.fn() } }));
vi.mock("swr", async (importOriginal) => ({
  ...(await importOriginal<typeof import("swr")>()),
  mutate: vi.fn(),
}));

const fileInput = (container: HTMLElement) =>
  container.querySelector('input[type="file"]') as HTMLInputElement;

const image = (name = "me.png", type = "image/png", bytes = 1024) =>
  new File([new Uint8Array(bytes)], name, { type });

const setup = (
  props: Partial<React.ComponentProps<typeof AvatarUploader>> = {},
  locale: "en" | "es" = "en"
) => {
  const user = userEvent.setup({ applyAccept: false });
  const view = renderWithProviders(
    <AvatarUploader imageUrl={null} canRemove={false} {...props} />,
    { locale }
  );
  return { user, ...view };
};

const serverError = (code: string, params = {}) =>
  new AxiosError("failed", "ERR_BAD_REQUEST", undefined, undefined, {
    data: { code, params },
    status: 400,
    statusText: "",
    headers: {},
    config: {},
  } as never);

describe("AvatarUploader", () => {
  beforeEach(() => {
    vi.mocked(uploadAvatar).mockResolvedValue({ url: "https://cdn.example.com/a.png" });
    vi.mocked(removeAvatar).mockResolvedValue({ url: null });
  });

  it("offers to add a photo when there is none", () => {
    setup();

    expect(screen.getByRole("button", { name: "Add photo" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove photo" })).not.toBeInTheDocument();
    expect(screen.getByText("JPG, PNG or WebP, up to 2 MB")).toBeInTheDocument();
  });

  it("offers to change or remove an existing photo", () => {
    setup({ imageUrl: "https://cdn.sanity.io/images/p/d/a.png", canRemove: true });

    expect(screen.getByRole("button", { name: "Change photo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove photo" })).toBeInTheDocument();
  });

  it("describes the accepted formats on the change button", () => {
    setup();
    expect(screen.getByRole("button", { name: "Add photo" })).toHaveAccessibleDescription(
      "JPG, PNG or WebP, up to 2 MB"
    );
  });

  it("uploads a valid image, refreshes the profile and confirms", async () => {
    const { user, container } = setup();
    const file = image();

    await user.upload(fileInput(container), file);

    await waitFor(() => expect(uploadAvatar).toHaveBeenCalledWith(file));
    expect(mutate).toHaveBeenCalledWith("/api/me");
    expect(toast.success).toHaveBeenCalledWith("Profile photo updated");
    expect(notifyError).not.toHaveBeenCalled();
  });

  it("rejects unsupported formats before uploading", async () => {
    const { user, container } = setup();

    await user.upload(fileInput(container), image("anim.gif", "image/gif"));

    expect(notifyError).toHaveBeenCalledWith("Use a JPG, PNG or WebP image.");
    expect(uploadAvatar).not.toHaveBeenCalled();
  });

  it("rejects images over the size limit before uploading", async () => {
    const { user, container } = setup();

    await user.upload(fileInput(container), image("big.png", "image/png", 3 * 1024 * 1024));

    expect(notifyError).toHaveBeenCalledWith("The image is too large. The maximum size is 2 MB.");
    expect(uploadAvatar).not.toHaveBeenCalled();
  });

  it("shows the translated message sent by the server", async () => {
    vi.mocked(uploadAvatar).mockRejectedValue(serverError("avatarType"));
    const { user, container } = setup();

    await user.upload(fileInput(container), image());

    await waitFor(() =>
      expect(notifyError).toHaveBeenCalledWith("Use a JPG, PNG or WebP image.")
    );
    expect(mutate).not.toHaveBeenCalled();
  });

  it("falls back to a generic message for unexpected failures", async () => {
    vi.mocked(uploadAvatar).mockRejectedValue(new Error("boom"));
    const { user, container } = setup();

    await user.upload(fileInput(container), image());

    await waitFor(() =>
      expect(notifyError).toHaveBeenCalledWith(
        "We could not update your photo. Please try again."
      )
    );
  });

  it("removes the photo and refreshes the profile", async () => {
    const { user } = setup({ imageUrl: "https://cdn.sanity.io/images/p/d/a.png", canRemove: true });

    await user.click(screen.getByRole("button", { name: "Remove photo" }));

    await waitFor(() => expect(removeAvatar).toHaveBeenCalled());
    expect(mutate).toHaveBeenCalledWith("/api/me");
    expect(toast.success).toHaveBeenCalledWith("Profile photo removed");
  });

  it("is translated on the Spanish site", () => {
    setup({ imageUrl: "https://cdn.sanity.io/images/p/d/a.png", canRemove: true }, "es");

    expect(screen.getByRole("button", { name: "Cambiar foto" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Quitar foto" })).toBeInTheDocument();
    expect(screen.getByText("JPG, PNG o WebP, hasta 2 MB")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = setup({ imageUrl: "https://cdn.sanity.io/images/p/d/a.png", canRemove: true });
    expect(await axe(container)).toHaveNoViolations();
  });
});

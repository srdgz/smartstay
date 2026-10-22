import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { axe } from "@/test/axe";
import { renderWithProviders } from "@/test/render";

import HotelPhotoGallery from "./HotelPhotoGallery";

const photos = [1, 2, 3, 4].map((n) => ({
  id: `p${n}`,
  url: `https://images.unsplash.com/photo-${n}.jpg`,
}));

describe("HotelPhotoGallery", () => {
  it("renders nothing without photos", () => {
    const { container } = renderWithProviders(<HotelPhotoGallery photos={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("opens the full gallery as a labelled modal dialog", async () => {
    renderWithProviders(<HotelPhotoGallery photos={photos} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Show all photos" }));

    const dialog = screen.getByRole("dialog", { name: "Room photo gallery" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it("closes with Escape and returns focus to the opener", async () => {
    renderWithProviders(<HotelPhotoGallery photos={photos} />);
    const user = userEvent.setup();
    const opener = screen.getByRole("button", { name: "Show all photos" });

    await user.click(opener);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("moves through the photos and reports the position", async () => {
    renderWithProviders(<HotelPhotoGallery photos={photos} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Open photo 3 in gallery" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent("3 / 4");

    await user.click(screen.getAllByRole("button", { name: "Next photo" }).slice(-1)[0]);
    expect(dialog).toHaveTextContent("4 / 4");
  });

  it("is translated on the Spanish site", () => {
    renderWithProviders(<HotelPhotoGallery photos={photos} />, { locale: "es" });
    expect(screen.getByRole("button", { name: "Mostrar todas las fotos" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithProviders(<HotelPhotoGallery photos={photos} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

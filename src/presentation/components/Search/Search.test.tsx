import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "@/test/axe";
import { renderWithProviders } from "@/test/render";
import { describe, expect, it, vi } from "vitest";

import Search from "./Search";

const push = vi.fn();

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push }),
}));

const renderSearch = () => {
  const props = {
    roomTypeFilter: "Luxury",
    searchQuery: "sea",
    setRoomTypeFilter: vi.fn(),
    setSearchQuery: vi.fn(),
  };
  renderWithProviders(<Search {...props} />);
  return props;
};

describe("Search", () => {
  it("labels every field", () => {
    renderSearch();
    expect(screen.getByLabelText("Room Type")).toHaveValue("Luxury");
    expect(screen.getByLabelText("Search")).toHaveValue("sea");
  });

  it("reports changes to the filters", async () => {
    const props = renderSearch();
    const user = userEvent.setup();

    await user.selectOptions(screen.getByLabelText("Room Type"), "Suite");
    expect(props.setRoomTypeFilter).toHaveBeenCalledWith("Suite");

    await user.type(screen.getByLabelText("Search"), "x");
    expect(props.setSearchQuery).toHaveBeenCalledWith("seax");
  });

  it("navigates to the filtered list", async () => {
    renderSearch();
    await userEvent.setup().click(screen.getByRole("button", { name: "Search" }));
    expect(push).toHaveBeenCalledWith("/rooms?roomType=Luxury&searchQuery=sea");
  });

  it("has no accessibility violations", async () => {
    renderSearch();
    expect(await axe(document.body)).toHaveNoViolations();
  });
});

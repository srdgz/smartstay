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

const renderSearch = (dates: { checkinDate?: Date; checkoutDate?: Date } = {}) => {
  const props = {
    roomTypeFilter: "Luxury",
    searchQuery: "sea",
    checkinDate: dates.checkinDate ?? null,
    checkoutDate: dates.checkoutDate ?? null,
    setCheckinDate: vi.fn(),
    setCheckoutDate: vi.fn(),
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
    expect(screen.getByLabelText("Check In")).toBeInTheDocument();
    expect(screen.getByLabelText("Check Out")).toBeInTheDocument();
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

  it("adds the dates to the search when both are chosen", async () => {
    renderSearch({
      checkinDate: new Date(2030, 4, 10),
      checkoutDate: new Date(2030, 4, 15),
    });
    push.mockClear();
    await userEvent.setup().click(screen.getByRole("button", { name: "Search" }));
    expect(push).toHaveBeenCalledWith(
      "/rooms?roomType=Luxury&searchQuery=sea&checkin=2030-05-10&checkout=2030-05-15"
    );
  });

  it("asks for both dates when only one is chosen", async () => {
    renderSearch({ checkinDate: new Date(2030, 4, 10) });
    push.mockClear();
    await userEvent.setup().click(screen.getByRole("button", { name: "Search" }));
    expect(push).not.toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    renderSearch();
    expect(await axe(document.body)).toHaveNoViolations();
  });
});

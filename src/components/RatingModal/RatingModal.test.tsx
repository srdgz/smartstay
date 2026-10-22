import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "@/test/axe";
import { describe, expect, it, vi } from "vitest";

import RatingModal from "./RatingModal";

const setup = (overrides: Partial<React.ComponentProps<typeof RatingModal>> = {}) => {
  const props = {
    isOpen: true,
    ratingValue: 0,
    setRatingValue: vi.fn(),
    ratingText: "",
    setRatingText: vi.fn(),
    reviewSubmitHandler: vi.fn(async () => undefined),
    isSubmittingReview: false,
    toggleRatingModal: vi.fn(),
    ...overrides,
  };
  const user = userEvent.setup();
  const view = render(<RatingModal {...props} />);
  return { props, user, ...view };
};

describe("RatingModal", () => {
  it("renders nothing while closed", () => {
    setup({ isOpen: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("is a labelled modal dialog and focuses its first control", () => {
    setup();
    const dialog = screen.getByRole("dialog", { name: "Rate Your Experience" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("button", { name: "1 star" })).toHaveFocus();
  });

  it("closes with Escape", async () => {
    const { props, user } = setup();
    await user.keyboard("{Escape}");
    expect(props.toggleRatingModal).toHaveBeenCalledTimes(1);
  });

  it("keeps focus inside the dialog in both directions", async () => {
    const { user } = setup();
    const cancel = screen.getByRole("button", { name: "Cancel" });
    const firstStar = screen.getByRole("button", { name: "1 star" });

    cancel.focus();
    await user.tab();
    expect(firstStar).toHaveFocus();

    await user.tab({ shift: true });
    expect(cancel).toHaveFocus();
  });

  it("selects a rating and reports it as pressed", async () => {
    const { props, user, rerender } = setup();
    await user.click(screen.getByRole("button", { name: "4 stars" }));
    expect(props.setRatingValue).toHaveBeenCalledWith(4);

    rerender(<RatingModal {...props} ratingValue={4} />);
    expect(screen.getByRole("button", { name: "4 stars" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "5 stars" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("disables submitting while a review is being sent", () => {
    setup({ isSubmittingReview: true });
    expect(screen.getByRole("button", { name: "Submitting" })).toBeDisabled();
  });

  it("has no accessibility violations", async () => {
    const { container } = setup({ ratingValue: 3 });
    expect(await axe(container)).toHaveNoViolations();
  });
});

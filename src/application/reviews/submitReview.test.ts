import { beforeEach, describe, expect, it } from "vitest";

import { ValidationError } from "@/domain/errors";
import { InMemoryReviewRepository } from "@/test/fakes";

import { makeSubmitReview } from "./submitReview";

const input = { userId: "user-1", roomId: "room-1", rating: 4, text: "  Lovely stay  " };

describe("submitReview", () => {
  let reviews: InMemoryReviewRepository;
  let submitReview: ReturnType<typeof makeSubmitReview>;

  beforeEach(() => {
    reviews = new InMemoryReviewRepository();
    submitReview = makeSubmitReview({ reviews });
  });

  it("creates a review with trimmed text when none exists", async () => {
    const result = await submitReview(input);

    expect(result).toEqual({ created: true });
    expect(reviews.created).toEqual([
      { userId: "user-1", roomId: "room-1", rating: 4, text: "Lovely stay" },
    ]);
  });

  it("updates the existing review instead of duplicating it", async () => {
    reviews.existingId = "review-9";

    const result = await submitReview(input);

    expect(result).toEqual({ created: false });
    expect(reviews.created).toHaveLength(0);
    expect(reviews.updated).toEqual([
      { id: "review-9", changes: { rating: 4, text: "Lovely stay" } },
    ]);
  });

  it.each([
    [{ text: "   " }, /write your review/],
    [{ rating: 0 }, /rating/],
    [{ rating: 6 }, /rating/],
    [{ rating: 3.5 }, /rating/],
    [{ roomId: "" }, /choose a room/],
  ])("rejects invalid input %o", async (override, message) => {
    await expect(submitReview({ ...input, ...override })).rejects.toThrow(message);
    await expect(submitReview({ ...input, ...override })).rejects.toBeInstanceOf(
      ValidationError
    );
    expect(reviews.created).toHaveLength(0);
  });
});

import { MAX_RATING, MIN_RATING } from "@/domain/booking/limits";
import { ValidationError } from "@/domain/errors";
import type { ReviewRepository } from "@/domain/review/ReviewRepository";

export type SubmitReviewInput = {
  userId: string;
  roomId: string;
  rating: number;
  text: string;
};

export const makeSubmitReview =
  ({ reviews }: { reviews: ReviewRepository }) =>
  async ({ userId, roomId, rating, text }: SubmitReviewInput) => {
    const trimmed = text.trim();

    if (!roomId) {
      throw new ValidationError("Please choose a room to review.", "reviewRoomRequired");
    }
    if (!trimmed) {
      throw new ValidationError("Please write your review.", "reviewTextRequired");
    }
    if (!Number.isInteger(rating) || rating < MIN_RATING || rating > MAX_RATING) {
      throw new ValidationError(
        `The rating must be between ${MIN_RATING} and ${MAX_RATING}.`,
        "ratingRange",
        { min: MIN_RATING, max: MAX_RATING }
      );
    }

    const existingId = await reviews.findIdByUserAndRoom(userId, roomId);

    if (existingId) {
      await reviews.update(existingId, { rating, text: trimmed });
      return { created: false };
    }

    await reviews.create({ userId, roomId, rating, text: trimmed });
    return { created: true };
  };

import type { ReviewRepository } from "@/domain/review/ReviewRepository";

export const makeGetRoomReviews =
  ({ reviews }: { reviews: ReviewRepository }) =>
  (roomId: string) =>
    reviews.findByRoom(roomId);

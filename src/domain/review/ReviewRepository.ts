import type { NewReview, Review, ReviewChanges } from "./Review";

export interface ReviewRepository {
  findByRoom(roomId: string): Promise<Review[]>;
  findIdByUserAndRoom(userId: string, roomId: string): Promise<string | null>;
  create(review: NewReview): Promise<void>;
  update(reviewId: string, changes: ReviewChanges): Promise<void>;
}

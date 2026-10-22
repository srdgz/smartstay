import type { SanityClient } from "next-sanity";

import type { NewReview, Review, ReviewChanges } from "@/domain/review/Review";
import type { ReviewRepository } from "@/domain/review/ReviewRepository";

import { toReview, type SanityReviewDoc } from "./mappers";
import { reviewIdByUserAndRoomQuery, roomReviewsQuery } from "./queries";

const noCache = { cache: "no-cache" } as const;

export class SanityReviewRepository implements ReviewRepository {
  constructor(private readonly client: SanityClient) {}

  async findByRoom(roomId: string): Promise<Review[]> {
    const docs = await this.client.fetch<SanityReviewDoc[]>(roomReviewsQuery, { roomId }, noCache);
    return docs.map(toReview);
  }

  async findIdByUserAndRoom(userId: string, roomId: string): Promise<string | null> {
    const doc = await this.client.fetch<{ _id: string } | null>(
      reviewIdByUserAndRoomQuery,
      { userId, roomId },
      noCache
    );
    return doc?._id ?? null;
  }

  async create(review: NewReview): Promise<void> {
    await this.client.create({
      _type: "review",
      user: { _type: "reference", _ref: review.userId },
      hotelRoom: { _type: "reference", _ref: review.roomId },
      userRating: review.rating,
      text: review.text,
    });
  }

  async update(reviewId: string, changes: ReviewChanges): Promise<void> {
    await this.client
      .patch(reviewId)
      .set({ text: changes.text, userRating: changes.rating })
      .commit();
  }
}

export type Review = {
  id: string;
  text: string;
  rating: number;
  authorName: string;
  createdAt: string;
};

export type NewReview = {
  userId: string;
  roomId: string;
  rating: number;
  text: string;
};

export type ReviewChanges = {
  rating: number;
  text: string;
};

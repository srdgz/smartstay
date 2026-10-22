import { FC } from "react";

import { useRoomReviews } from "@/presentation/hooks/useApi";
import { getErrorMessage } from "@/presentation/lib/errorMessage";

import Rating from "../Rating/Rating";

const RoomReview: FC<{ roomId: string }> = ({ roomId }) => {
  const { data: roomReviews, error, isLoading } = useRoomReviews(roomId);

  if (error) {
    return (
      <p role="alert" className="col-span-full">
        {getErrorMessage(error, "We could not load the reviews. Please try again later.")}
      </p>
    );
  }

  if (!isLoading && roomReviews && !roomReviews.length) {
    return <p className="col-span-full">No reviews yet.</p>;
  }

  return (
    <>
      {roomReviews &&
        roomReviews.map((review) => (
          <div
            className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg"
            key={review.id}
          >
            <div className="font-semibold mb-2 flex">
              <p>{review.authorName}</p>
              <div className="ml-4 flex items-center text-amber-700 dark:text-yellow-500 text-lg">
                <Rating rating={review.rating} />
              </div>
            </div>

            <p>{review.text}</p>
          </div>
        ))}
    </>
  );
};

export default RoomReview;

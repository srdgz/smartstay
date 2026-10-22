import axios from "axios";
import { FC } from "react";
import useSWR from "swr";

import { Review } from "@/models/reviews";
import Rating from "../Rating/Rating";
import { getErrorMessage } from "@/libs/errorMessage";

const RoomReview: FC<{ roomId: string }> = ({ roomId }) => {
  const fetchRoomReviews = async () => {
    const { data } = await axios.get<Review[]>(`/api/room-reviews/${roomId}`);
    return data;
  };

  const {
    data: roomReviews,
    error,
    isLoading,
  } = useSWR(`/api/room-reviews/${roomId}`, fetchRoomReviews);

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
            key={review._id}
          >
            <div className="font-semibold mb-2 flex">
              <p>{review.user.name}</p>
              <div className="ml-4 flex items-center text-amber-700 dark:text-yellow-500 text-lg">
                <Rating rating={review.userRating} />
              </div>
            </div>

            <p>{review.text}</p>
          </div>
        ))}
    </>
  );
};

export default RoomReview;

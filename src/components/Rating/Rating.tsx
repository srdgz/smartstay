import { FC } from "react";
import { FaStar, FaStarHalf } from "react-icons/fa";

type Props = {
  rating: number;
};

const Rating: FC<Props> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const decimalPart = rating - fullStars;

  const fullStarElements = Array.from({ length: fullStars }, (_, index) => (
    <FaStar key={index} aria-hidden="true" />
  ));

  let halfStarElement = null;

  if (decimalPart > 0) {
    halfStarElement = <FaStarHalf aria-hidden="true" />;
  }

  return (
    <span role="img" aria-label={`Rated ${rating} out of 5`}>
      {fullStarElements} {halfStarElement}
    </span>
  );
};

export default Rating;

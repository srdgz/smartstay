import { useTranslations } from "next-intl";
import { FC } from "react";
import { FaStar, FaStarHalf } from "react-icons/fa";

type Props = {
  rating: number;
};

const Rating: FC<Props> = ({ rating }) => {
  const t = useTranslations("Reviews");
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
    <span
      role="img"
      aria-label={t("rated", { rating })}
      className="inline-flex items-center gap-0.5"
    >
      {fullStarElements}
      {halfStarElement}
    </span>
  );
};

export default Rating;

import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useRef } from "react";
import { BsStarFill } from "react-icons/bs";

import useModalFocus from "@/presentation/hooks/useModalFocus";

type Props = {
  isOpen: boolean;
  ratingValue: number | null;
  setRatingValue: Dispatch<SetStateAction<number | null>>;
  ratingText: string;
  setRatingText: Dispatch<SetStateAction<string>>;
  reviewSubmitHandler: () => Promise<string | undefined>;
  isSubmittingReview: boolean;
  toggleRatingModal: () => void;
};

const RatingModal: FC<Props> = (props) => {
  const {
    isOpen,
    ratingValue,
    setRatingValue,
    ratingText,
    setRatingText,
    reviewSubmitHandler,
    isSubmittingReview,
    toggleRatingModal,
  } = props;

  const t = useTranslations("RatingModal");
  const dialogRef = useRef<HTMLDivElement>(null);
  useModalFocus(isOpen, dialogRef, toggleRatingModal);

  const starValues = [1, 2, 3, 4, 5];

  if (!isOpen) return null;

  return (
    <div className="fixed z-[61] inset-0 flex items-center justify-center">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rating-dialog-title"
        className="bg-white w-96 max-w-[calc(100vw-2rem)] p-4 rounded-lg shadow-lg"
      >
        <h2
          id="rating-dialog-title"
          className="text-xl dark:text-gray-800 font-semibold mb-2"
        >
          {t("title")}
        </h2>
        <div className="mb-4" role="group" aria-labelledby="rating-label">
          <span
            id="rating-label"
            className="block text-sm font-medium text-gray-700"
          >
            {t("rating")}
          </span>
          <div className="flex items-center">
            {starValues.map((value) => (
              <button
                type="button"
                className={`w-6 h-6 ${
                  ratingValue !== null && value <= ratingValue
                    ? "text-amber-600"
                    : "text-gray-500"
                }`}
                onClick={() => setRatingValue(value)}
                aria-label={t("stars", { count: value })}
                aria-pressed={ratingValue === value}
                key={value}
              >
                <BsStarFill aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="rating-text"
            className="block text-sm font-medium text-gray-700"
          >
            {t("reviewText")}
          </label>

          <textarea
            id="rating-text"
            value={ratingText}
            onChange={(e) => setRatingText(e.target.value)}
            rows={4}
            className="w-full px-2 py-3 border rounded-md text-black"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={reviewSubmitHandler}
            className="px-4 py-2 bg-primary text-white rounded-md"
            disabled={isSubmittingReview}
          >
            {isSubmittingReview ? t("submitting") : t("submit")}
          </button>
          <button
            type="button"
            onClick={toggleRatingModal}
            className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;

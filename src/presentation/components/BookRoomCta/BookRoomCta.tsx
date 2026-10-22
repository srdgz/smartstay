"use client";

import { es } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  MAX_ADULTS,
  MAX_CHILDREN,
  MIN_ADULTS,
  MIN_CHILDREN,
} from "@/domain/booking/limits";
import { discountedPrice, nightsBetween, stayTotal } from "@/domain/room/pricing";
import { useMoney } from "@/presentation/hooks/useMoney";
import { toDateOnly } from "@/presentation/lib/dateOnly";

registerLocale("es", es);

type Props = {
  checkinDate: Date | null;
  setCheckinDate: Dispatch<SetStateAction<Date | null>>;
  checkoutDate: Date | null;
  setCheckoutDate: Dispatch<SetStateAction<Date | null>>;
  setAdults: Dispatch<SetStateAction<number>>;
  setNoOfChildren: Dispatch<SetStateAction<number>>;
  calcMinCheckoutDate: () => Date | null;
  price: number;
  discount: number;
  adults: number;
  noOfChildren: number;
  specialNote: string;
  isBooked: boolean;
  handleBookNowClick: () => void;
};

const BookRoomCta: FC<Props> = (props) => {
  const {
    price,
    discount,
    specialNote,
    checkinDate,
    setCheckinDate,
    checkoutDate,
    setCheckoutDate,
    calcMinCheckoutDate,
    setAdults,
    setNoOfChildren,
    adults,
    noOfChildren,
    isBooked,
    handleBookNowClick,
  } = props;

  const t = useTranslations("Booking");
  const locale = useLocale();
  const { format } = useMoney();

  const discountPrice = discountedPrice(price, discount);
  const datePickerLocale = locale === "es" ? "es" : undefined;

  const calcNoOfDays = () => {
    if (!checkinDate || !checkoutDate) return 0;
    return nightsBetween(toDateOnly(checkinDate), toDateOnly(checkoutDate));
  };

  return (
    <div className="px-7 py-6">
      <p>
        <span
          className={`${
            discount ? "line-through text-gray-600 dark:text-gray-400" : ""
          } font-bold text-xl`}
        >
          <span className="sr-only">{t("originalPrice")} </span>
          {format(price)}
        </span>
        {discount ? (
          <span className="font-bold text-xl">
            {" "}
            {t("discountNow", { discount })}{" "}
            <span className="text-tertiary-dark dark:text-tertiary-darkmode">
              {format(discountPrice)}
            </span>
          </span>
        ) : (
          ""
        )}
      </p>

      <div className="w-full border-b-2 border-b-secondary my-2" />

      <p className="my-8">{specialNote}</p>

      <div className="flex">
        <div className="w-1/2 pr-2">
          <label
            htmlFor="check-in-date"
            className="block text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            {t("checkIn")}
          </label>
          <DatePicker
            selected={checkinDate}
            onChange={(date) => setCheckinDate(date)}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            id="check-in-date"
            locale={datePickerLocale}
            placeholderText={t("datePlaceholder")}
            autoComplete="off"
            className="w-full border text-black text-sm border-gray-300 rounded-lg px-2 py-2.5 focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label
            htmlFor="check-out-date"
            className="block text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            {t("checkOut")}
          </label>
          <DatePicker
            selected={checkoutDate}
            onChange={(date) => setCheckoutDate(date)}
            dateFormat="dd/MM/yyyy"
            disabled={!checkinDate}
            minDate={calcMinCheckoutDate()}
            id="check-out-date"
            locale={datePickerLocale}
            placeholderText={t("datePlaceholder")}
            autoComplete="off"
            className="w-full border text-black text-sm border-gray-300 rounded-lg px-2 py-2.5 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="flex mt-4">
        <div className="w-1/2 pr-2">
          <label
            htmlFor="adults"
            className="block text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            {t("adults")}
          </label>
          <input
            type="number"
            id="adults"
            value={adults}
            onChange={(e) => setAdults(+e.target.value)}
            min={MIN_ADULTS}
            max={MAX_ADULTS}
            className="w-full border border-gray-300 rounded-lg p-2.5"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label
            htmlFor="children"
            className="block text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            {t("children")}
          </label>
          <input
            type="number"
            id="children"
            value={noOfChildren}
            onChange={(e) => setNoOfChildren(+e.target.value)}
            min={MIN_CHILDREN}
            max={MAX_CHILDREN}
            className="w-full border border-gray-300 rounded-lg p-2.5"
          />
        </div>
      </div>

      <div aria-live="polite">
        {calcNoOfDays() > 0 && (
          <p className="mt-3">
            {t("total", { price: format(stayTotal(price, discount, calcNoOfDays())) })}
          </p>
        )}
      </div>

      <button
        type="button"
        disabled={isBooked}
        onClick={handleBookNowClick}
        className="btn-primary w-full mt-6 disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {isBooked ? t("booked") : t("bookNow")}
      </button>
    </div>
  );
};

export default BookRoomCta;

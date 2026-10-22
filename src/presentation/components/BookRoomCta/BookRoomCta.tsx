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

const labelClass = "mb-1 block text-sm font-semibold";
const fieldClass = "field px-3 text-sm";

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
  const tRoom = useTranslations("RoomDetails");
  const locale = useLocale();
  const { format } = useMoney();

  const discountPrice = discountedPrice(price, discount);
  const datePickerLocale = locale === "es" ? "es" : undefined;

  const calcNoOfDays = () => {
    if (!checkinDate || !checkoutDate) return 0;
    return nightsBetween(toDateOnly(checkinDate), toDateOnly(checkoutDate));
  };

  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-2">
        {discount ? (
          <>
            <span className="text-2xl font-extrabold text-tertiary-dark dark:text-tertiary-darkmode">
              {format(discountPrice)}
            </span>
            <span className="text-muted text-lg line-through">
              <span className="sr-only">{t("originalPrice")} </span>
              {format(price)}
            </span>
          </>
        ) : (
          <span className="text-2xl font-extrabold">{format(price)}</span>
        )}
        <span className="text-muted text-sm">/ {tRoom("perNight")}</span>
        {discount ? (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-ink dark:bg-neutral-800 dark:text-neutral-100">
            {t("discountBadge", { discount })}
          </span>
        ) : null}
      </p>

      <p className="text-muted mt-4 text-sm">{specialNote}</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="check-in-date" className={labelClass}>
            {t("checkIn")}
          </label>
          <DatePicker
            selected={checkinDate}
            onChange={(date: Date | null) => setCheckinDate(date)}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            id="check-in-date"
            locale={datePickerLocale}
            placeholderText={t("datePlaceholder")}
            autoComplete="off"
            className={fieldClass}
            wrapperClassName="block"
          />
        </div>
        <div>
          <label htmlFor="check-out-date" className={labelClass}>
            {t("checkOut")}
          </label>
          <DatePicker
            selected={checkoutDate}
            onChange={(date: Date | null) => setCheckoutDate(date)}
            dateFormat="dd/MM/yyyy"
            disabled={!checkinDate}
            minDate={calcMinCheckoutDate() ?? undefined}
            id="check-out-date"
            locale={datePickerLocale}
            placeholderText={t("datePlaceholder")}
            autoComplete="off"
            className={`${fieldClass} disabled:opacity-60`}
            wrapperClassName="block"
          />
        </div>
        <div>
          <label htmlFor="adults" className={labelClass}>
            {t("adults")}
          </label>
          <input
            type="number"
            id="adults"
            value={adults}
            onChange={(e) => setAdults(+e.target.value)}
            min={MIN_ADULTS}
            max={MAX_ADULTS}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="children" className={labelClass}>
            {t("children")}
          </label>
          <input
            type="number"
            id="children"
            value={noOfChildren}
            onChange={(e) => setNoOfChildren(+e.target.value)}
            min={MIN_CHILDREN}
            max={MAX_CHILDREN}
            className="field"
          />
        </div>
      </div>

      <div aria-live="polite">
        {calcNoOfDays() > 0 && (
          <p className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4 text-lg font-bold dark:border-neutral-800">
            {t("total", { price: format(stayTotal(price, discount, calcNoOfDays())) })}
          </p>
        )}
      </div>

      <button
        type="button"
        disabled={isBooked}
        onClick={handleBookNowClick}
        className="btn-primary mt-6 w-full py-4 text-lg"
      >
        {isBooked ? t("booked") : t("bookNow")}
      </button>
    </div>
  );
};

export default BookRoomCta;

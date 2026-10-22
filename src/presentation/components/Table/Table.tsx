"use client";

import { useFormatter, useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction } from "react";

import type { Booking } from "@/domain/booking/Booking";
import { stayStatus } from "@/domain/booking/stay";
import { Link } from "@/i18n/navigation";
import { useMoney } from "@/presentation/hooks/useMoney";
import { fromDateOnly, toDateOnly } from "@/presentation/lib/dateOnly";

type Props = {
  bookingDetails: Booking[];
  setRoomId: Dispatch<SetStateAction<string | null>>;
  toggleRatingModal: () => void;
};

const Table: FC<Props> = ({ bookingDetails, setRoomId, toggleRatingModal }) => {
  const t = useTranslations("Table");
  const { formatIn } = useMoney();
  const format = useFormatter();
  const today = toDateOnly(new Date());

  const formatDate = (value: string) => {
    const date = fromDateOnly(value);
    return date ? format.dateTime(date, { dateStyle: "medium" }) : value;
  };

  return (
    <div
      role="region"
      aria-label={t("region")}
      tabIndex={0}
      className="overflow-x-auto max-w-[340px] rounded-lg mx-auto md:max-w-full shadow-md sm:rounded-lg"
    >
      <table className="w-full text-sm text-left text-gray-500">
        <caption className="sr-only">{t("caption")}</caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">{t("room")}</th>
            <th scope="col" className="px-6 py-3">{t("checkIn")}</th>
            <th scope="col" className="px-6 py-3">{t("checkOut")}</th>
            <th scope="col" className="px-6 py-3">{t("price")}</th>
            <th scope="col" className="px-6 py-3">{t("daysBooked")}</th>
            <th scope="col" className="px-6 py-3">{t("status")}</th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">{t("actions")}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {bookingDetails.map((booking) => (
            <tr
              key={booking.id}
              className="bg-white border-b hover:bg-gray-50"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap"
              >
                <Link
                  href={`/rooms/${booking.room.slug}`}
                  className="underline text-blue-600"
                >
                  {booking.room.name}
                </Link>
              </th>
              <td className="px-6 py-4 whitespace-nowrap">
                <time dateTime={booking.checkinDate}>{formatDate(booking.checkinDate)}</time>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <time dateTime={booking.checkoutDate}>{formatDate(booking.checkoutDate)}</time>
              </td>
              <td className="px-6 py-4">
                {formatIn(booking.chargedAmount, booking.currency)}
              </td>
              <td className="px-6 py-4">{booking.numberOfDays}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {t(stayStatus(booking.checkinDate, booking.checkoutDate, today))}
              </td>
              <td className="px-6 py-4">
                <button
                  type="button"
                  aria-label={t("rateRoom", { name: booking.room.name })}
                  onClick={() => {
                    setRoomId(booking.room.id);
                    toggleRatingModal();
                  }}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {t("rate")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

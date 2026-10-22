"use client";

import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction } from "react";

import type { Booking } from "@/domain/booking/Booking";
import { Link } from "@/i18n/navigation";
import { useMoney } from "@/presentation/hooks/useMoney";

type Props = {
  bookingDetails: Booking[];
  setRoomId: Dispatch<SetStateAction<string | null>>;
  toggleRatingModal: () => void;
};

const Table: FC<Props> = ({ bookingDetails, setRoomId, toggleRatingModal }) => {
  const t = useTranslations("Table");
  const { formatIn } = useMoney();

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
            <th scope="col" className="px-6 py-3">{t("unitPrice")}</th>
            <th scope="col" className="px-6 py-3">{t("price")}</th>
            <th scope="col" className="px-6 py-3">{t("discount")}</th>
            <th scope="col" className="px-6 py-3">{t("daysBooked")}</th>
            <th scope="col" className="px-6 py-3">{t("daysLeft")}</th>
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
              <td className="px-6 py-4">
                {formatIn(booking.room.price * booking.exchangeRate, booking.currency)}
              </td>
              <td className="px-6 py-4">
                {formatIn(booking.chargedAmount, booking.currency)}
              </td>
              <td className="px-6 py-4">{booking.discount}%</td>
              <td className="px-6 py-4">{booking.numberOfDays}</td>
              <td className="px-6 py-4">0</td>
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

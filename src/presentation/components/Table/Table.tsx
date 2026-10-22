"use client";

import { Dispatch, FC, SetStateAction } from "react";
import Link from "next/link";

import type { Booking } from "@/domain/booking/Booking";

type Props = {
  bookingDetails: Booking[];
  setRoomId: Dispatch<SetStateAction<string | null>>;
  toggleRatingModal: () => void;
};

const Table: FC<Props> = ({ bookingDetails, setRoomId, toggleRatingModal }) => {
  return (
    <div
      role="region"
      aria-label="Current bookings table"
      tabIndex={0}
      className="overflow-x-auto max-w-[340px] rounded-lg mx-auto md:max-w-full shadow-md sm:rounded-lg"
    >
      <table className="w-full text-sm text-left text-gray-500">
        <caption className="sr-only">Current bookings</caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Room name</th>
            <th scope="col" className="px-6 py-3">Unit Price</th>
            <th scope="col" className="px-6 py-3">Price</th>
            <th scope="col" className="px-6 py-3">Discount</th>
            <th scope="col" className="px-6 py-3">Nº Days Booked</th>
            <th scope="col" className="px-6 py-3">Days Left</th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Actions</span>
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
              <td className="px-6 py-4">{booking.room.price}</td>
              <td className="px-6 py-4">{booking.totalPrice}</td>
              <td className="px-6 py-4">{booking.discount}</td>
              <td className="px-6 py-4">{booking.numberOfDays}</td>
              <td className="px-6 py-4">0</td>
              <td className="px-6 py-4">
                <button
                  type="button"
                  aria-label={`Rate ${booking.room.name}`}
                  onClick={() => {
                    setRoomId(booking.room.id);
                    toggleRatingModal();
                  }}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Rate
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

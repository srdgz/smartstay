"use client";

import {
  Chart as ChartJS,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { FC, useContext } from "react";
import { Bar } from "react-chartjs-2";

import ThemeContext from "@/context/themeContext";
import { Booking } from "@/models/booking";

ChartJS.register(Tooltip, CategoryScale, LinearScale, BarElement);

const Chart: FC<{ userBookings: Booking[] }> = ({ userBookings }) => {
  const { darkTheme } = useContext(ThemeContext);

  const labels = userBookings.map((booking) => booking.hotelRoom.name);
  const amountSpent = userBookings.map((booking) => booking.totalPrice);
  const totalSpent = amountSpent.reduce((sum, amount) => sum + amount, 0);

  const textColor = darkTheme ? "#FFFFFF" : "#1E1E1E";
  const gridColor = darkTheme ? "#6B7280" : "#D1D5DB";

  const options = {
    responsive: true,
    scales: {
      x: { ticks: { color: textColor }, grid: { color: gridColor } },
      y: { ticks: { color: textColor }, grid: { color: gridColor } },
    },
  };

  const summary = `Bar chart of the amount spent per booking. Total: $ ${totalSpent}.`;

  return (
    <figure>
      <figcaption className="font-semibold mb-4">
        Amount spent per booking (USD)
      </figcaption>
      <Bar
        role="img"
        aria-label={summary}
        options={options}
        data={{
          labels,
          datasets: [
            {
              label: "Amount spent",
              data: amountSpent,
              borderWidth: 1,
              backgroundColor: "#F27405",
              hoverBackgroundColor: "#F2C641",
            },
          ],
        }}
      />
      <table className="sr-only">
        <caption>Amount spent per booking</caption>
        <thead>
          <tr>
            <th scope="col">Room</th>
            <th scope="col">Amount spent (USD)</th>
          </tr>
        </thead>
        <tbody>
          {userBookings.map((booking) => (
            <tr key={booking._id}>
              <th scope="row">{booking.hotelRoom.name}</th>
              <td>{booking.totalPrice}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <td>{totalSpent}</td>
          </tr>
        </tfoot>
      </table>
    </figure>
  );
};

export default Chart;

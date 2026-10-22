"use client";

import {
  Chart as ChartJS,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { useTranslations } from "next-intl";
import { FC, useContext } from "react";
import { Bar } from "react-chartjs-2";

import type { Booking } from "@/domain/booking/Booking";
import { useMoney } from "@/presentation/hooks/useMoney";
import ThemeContext from "@/presentation/context/themeContext";

ChartJS.register(Tooltip, CategoryScale, LinearScale, BarElement);

const Chart: FC<{ userBookings: Booking[] }> = ({ userBookings }) => {
  const t = useTranslations("Chart");
  const { darkTheme } = useContext(ThemeContext);
  const { currency, convert, formatIn } = useMoney();

  const labels = userBookings.map((booking) => booking.room.name);
  const amountSpent = userBookings.map((booking) =>
    Math.round(convert(booking.totalPrice) * 100) / 100
  );
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

  const summary = t("summary", { total: formatIn(totalSpent, currency) });

  return (
    <figure>
      <figcaption className="font-semibold mb-4">
        {t("title", { currency })}
      </figcaption>
      <Bar
        role="img"
        aria-label={summary}
        options={options}
        data={{
          labels,
          datasets: [
            {
              label: t("dataset"),
              data: amountSpent,
              borderWidth: 1,
              backgroundColor: "#F27405",
              hoverBackgroundColor: "#F2C641",
            },
          ],
        }}
      />
      <table className="sr-only">
        <caption>{t("dataset")}</caption>
        <thead>
          <tr>
            <th scope="col">{t("room")}</th>
            <th scope="col">{t("dataset")} ({currency})</th>
          </tr>
        </thead>
        <tbody>
          {userBookings.map((booking, index) => (
            <tr key={booking.id}>
              <th scope="row">{booking.room.name}</th>
              <td>{formatIn(amountSpent[index], currency)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">{t("total")}</th>
            <td>{formatIn(totalSpent, currency)}</td>
          </tr>
        </tfoot>
      </table>
    </figure>
  );
};

export default Chart;

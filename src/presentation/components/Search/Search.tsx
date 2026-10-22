"use client";

import { es } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { FC, ChangeEvent } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiSearch } from "react-icons/fi";

import { useRouter } from "@/i18n/navigation";
import { addDays, toDateOnly } from "@/presentation/lib/dateOnly";
import { notifyError } from "@/presentation/lib/notify";

registerLocale("es", es);

type Props = {
  roomTypeFilter: string;
  searchQuery: string;
  checkinDate: Date | null;
  checkoutDate: Date | null;
  setRoomTypeFilter: (value: string) => void;
  setSearchQuery: (value: string) => void;
  setCheckinDate: (value: Date | null) => void;
  setCheckoutDate: (value: Date | null) => void;
};

const segment =
  "flex-1 rounded-2xl px-4 py-2 transition lg:rounded-full lg:hover:bg-gray-100 lg:dark:hover:bg-neutral-800";
const segmentLabel =
  "block text-xs font-bold uppercase tracking-wide text-ink dark:text-neutral-100";
const segmentControl =
  "w-full bg-transparent text-base font-medium text-ink placeholder:text-gray-600 dark:text-neutral-100 dark:placeholder:text-gray-400";

const Divider = () => (
  <div
    aria-hidden="true"
    className="hidden h-8 w-px bg-gray-200 dark:bg-neutral-700 lg:block"
  />
);

const Search: FC<Props> = ({
  roomTypeFilter,
  searchQuery,
  checkinDate,
  checkoutDate,
  setRoomTypeFilter,
  setSearchQuery,
  setCheckinDate,
  setCheckoutDate,
}) => {
  const t = useTranslations("Search");
  const locale = useLocale();
  const router = useRouter();
  const datePickerLocale = locale === "es" ? "es" : undefined;

  const handleRoomTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRoomTypeFilter(event.target.value);
  };
  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const handleCheckinChange = (date: Date | null) => {
    setCheckinDate(date);
    if (date && checkoutDate && checkoutDate <= date) setCheckoutDate(null);
  };
  const handleFilterClick = () => {
    if (Boolean(checkinDate) !== Boolean(checkoutDate)) {
      return notifyError(t("datesIncomplete"));
    }

    const params = new URLSearchParams({
      roomType: roomTypeFilter,
      searchQuery,
    });
    if (checkinDate && checkoutDate) {
      params.set("checkin", toDateOnly(checkinDate));
      params.set("checkout", toDateOnly(checkoutDate));
    }
    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <section className="page-container">
      <div className="card flex flex-col gap-2 rounded-3xl p-3 lg:flex-row lg:items-center lg:rounded-full lg:p-2">
        <div className={segment}>
          <label htmlFor="room-type" className={segmentLabel}>
            {t("roomType")}
          </label>
          <select
            id="room-type"
            onChange={handleRoomTypeChange}
            value={roomTypeFilter}
            className={`${segmentControl} cursor-pointer capitalize dark:[&>option]:bg-neutral-900`}
          >
            <option value="All">{t("all")}</option>
            <option value="Basic">{t("basic")}</option>
            <option value="Luxury">{t("luxury")}</option>
            <option value="Suite">{t("suite")}</option>
          </select>
        </div>
        <Divider />
        <div className={segment}>
          <label htmlFor="search-check-in" className={segmentLabel}>
            {t("checkIn")}
          </label>
          <DatePicker
            id="search-check-in"
            selected={checkinDate}
            onChange={handleCheckinChange}
            selectsStart
            startDate={checkinDate}
            endDate={checkoutDate}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            locale={datePickerLocale}
            placeholderText={t("datePlaceholder")}
            autoComplete="off"
            className={segmentControl}
            wrapperClassName="block"
          />
        </div>
        <Divider />
        <div className={segment}>
          <label htmlFor="search-check-out" className={segmentLabel}>
            {t("checkOut")}
          </label>
          <DatePicker
            id="search-check-out"
            selected={checkoutDate}
            onChange={(date: Date | null) => setCheckoutDate(date)}
            selectsEnd
            startDate={checkinDate}
            endDate={checkoutDate}
            minDate={checkinDate ? addDays(checkinDate, 1) : addDays(new Date(), 1)}
            dateFormat="dd/MM/yyyy"
            locale={datePickerLocale}
            placeholderText={t("datePlaceholder")}
            autoComplete="off"
            className={segmentControl}
            wrapperClassName="block"
          />
        </div>
        <Divider />
        <div className={segment}>
          <label htmlFor="search" className={segmentLabel}>
            {t("search")}
          </label>
          <input
            type="search"
            id="search"
            placeholder={t("placeholder")}
            value={searchQuery}
            onChange={handleSearchQueryChange}
            className={segmentControl}
          />
        </div>
        <button
          className="btn-primary lg:rounded-full lg:px-8 lg:py-4"
          type="button"
          onClick={handleFilterClick}
        >
          <FiSearch aria-hidden="true" />
          {t("search")}
        </button>
      </div>
    </section>
  );
};

export default Search;

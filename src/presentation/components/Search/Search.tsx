"use client";

import { useTranslations } from "next-intl";
import { FC, ChangeEvent } from "react";
import { FiSearch } from "react-icons/fi";

import { useRouter } from "@/i18n/navigation";

type Props = {
  roomTypeFilter: string;
  searchQuery: string;
  setRoomTypeFilter: (value: string) => void;
  setSearchQuery: (value: string) => void;
};

const segment =
  "flex-1 rounded-2xl px-4 py-2 transition md:rounded-full md:hover:bg-gray-100 md:dark:hover:bg-neutral-800";
const segmentLabel =
  "block text-xs font-bold uppercase tracking-wide text-ink dark:text-neutral-100";
const segmentControl =
  "w-full bg-transparent text-base font-medium text-ink placeholder:text-gray-600 dark:text-neutral-100 dark:placeholder:text-gray-400";

const Search: FC<Props> = ({
  roomTypeFilter,
  searchQuery,
  setRoomTypeFilter,
  setSearchQuery,
}) => {
  const t = useTranslations("Search");
  const router = useRouter();
  const handleRoomTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRoomTypeFilter(event.target.value);
  };
  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const handleFilterClick = () => {
    router.push(
      `/rooms?roomType=${encodeURIComponent(roomTypeFilter)}&searchQuery=${encodeURIComponent(
        searchQuery
      )}`
    );
  };
  return (
    <section className="page-container">
      <div className="card flex flex-col gap-2 rounded-3xl p-3 md:flex-row md:items-center md:rounded-full md:p-2">
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
        <div
          aria-hidden="true"
          className="hidden h-8 w-px bg-gray-200 dark:bg-neutral-700 md:block"
        />
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
          className="btn-primary md:rounded-full md:px-8 md:py-4"
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

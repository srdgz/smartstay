"use client";

import { useTranslations } from "next-intl";
import { FC, ChangeEvent } from "react";

import { useRouter } from "@/i18n/navigation";

type Props = {
  roomTypeFilter: string;
  searchQuery: string;
  setRoomTypeFilter: (value: string) => void;
  setSearchQuery: (value: string) => void;
};

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
    <section className="bg-tertiary-light px-4 py-6 rounded-lg dark:bg-[#212529]">
      <div className="container mx-auto px-4 flex gap-4 flex-wrap justify-between items-center">
        <div className="w-full md:1/3 lg:w-auto mb-4 md:mb-0">
          <label
            htmlFor="room-type"
            className="block text-sm font-medium mb-2 text-black dark:text-white"
          >
            {t("roomType")}
          </label>
          <div className="relative">
            <select
              id="room-type"
              onChange={handleRoomTypeChange}
              value={roomTypeFilter}
              className="w-full px-4 py-2 capitalize rounded-xl leading-tight bg-[#457B9D] dark:bg-[#F1FAEE] text-white dark:text-black"
            >
              <option value="All">{t("all")}</option>
              <option value="Basic">{t("basic")}</option>
              <option value="Luxury">{t("luxury")}</option>
              <option value="Suite">{t("suite")}</option>
            </select>
          </div>
        </div>
        <div className="w-full md:1/3 lg:w-auto mb-4 md:mb-0">
          <label
            htmlFor="search"
            className="block text-sm font-medium mb-2 text-black dark:text-white"
          >
            {t("search")}
          </label>
          <input
            type="search"
            id="search"
            placeholder={t("placeholder")}
            value={searchQuery}
            onChange={handleSearchQueryChange}
            className="w-full px-4 py-3 rounded-xl leading-tight bg-[#457B9D] dark:bg-[#F1FAEE] placeholder:text-white dark:placeholder:text-black text-white dark:text-black"
          ></input>
        </div>
        <button
          className="btn-primary"
          type="button"
          onClick={handleFilterClick}
        >
          {t("search")}
        </button>
      </div>
    </section>
  );
};

export default Search;

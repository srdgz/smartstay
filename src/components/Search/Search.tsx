"use client";

import { useRouter } from "next/navigation";
import { FC, ChangeEvent } from "react";

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
  const router = useRouter();
  const handleRoomTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRoomTypeFilter(event.target.value);
  };
  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const handleFilterClick = () => {
    router.push(`/rooms?roomType=${roomTypeFilter}&searchQuery=${searchQuery}`);
  };
  return (
    <section className="bg-tertiary-light px-4 py-6 rounded-lg dark:bg-[#212529]">
      <div className="container mx-auto px-4 flex gap-4 flex-wrap justify-between items-center">
        <div className="w-full md:1/3 lg:w-auto mb-4 md:mb-0">
          <label className="block text-sm font-medium mb-2 text-black dark:text-white">
            Room Type
          </label>
          <div className="relative">
            <select
              onChange={handleRoomTypeChange}
              value={roomTypeFilter}
              className="w-full px-4 py-2 capitalize rounded-xl leading-tight bg-[#457B9D] dark:bg-[#F1FAEE] focus: outline-none text-white dark:text-black"
            >
              <option value="All">All</option>
              <option value="Basic">Basic</option>
              <option value="Luxury">Luxury</option>
              <option value="Suite">Suite</option>
            </select>
          </div>
        </div>
        <div className="w-full md:1/3 lg:w-auto mb-4 md:mb-0">
          <label className="block text-sm font-medium mb-2 text-black dark:text-white">
            Search
          </label>
          <input
            type="search"
            id="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchQueryChange}
            className="w-full px-4 py-3 rounded-xl leading-tight bg-[#457B9D] dark:bg-[#F1FAEE] focus:outline-none placeholder:text-white dark:placeholder:text-black text-white dark:text-black"
          ></input>
        </div>
        <button
          className="btn-primary"
          type="button"
          onClick={handleFilterClick}
        >
          Search
        </button>
      </div>
    </section>
  );
};

export default Search;

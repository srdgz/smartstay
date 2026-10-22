"use client";

import { useState } from "react";

import Search from "../Search/Search";

const PageSearch = () => {
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
  return (
    <Search
      roomTypeFilter={roomTypeFilter}
      searchQuery={searchQuery}
      checkinDate={checkinDate}
      checkoutDate={checkoutDate}
      setRoomTypeFilter={setRoomTypeFilter}
      setSearchQuery={setSearchQuery}
      setCheckinDate={setCheckinDate}
      setCheckoutDate={setCheckoutDate}
    />
  );
};

export default PageSearch;

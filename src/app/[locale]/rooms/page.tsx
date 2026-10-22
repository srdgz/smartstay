"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import type { Room } from "@/domain/room/Room";
import { useRooms } from "@/presentation/hooks/useApi";
import Search from "@/presentation/components/Search/Search";
import RoomCard from "@/presentation/components/RoomCard/RoomCard";
import { fromDateOnly, toDateOnly } from "@/presentation/lib/dateOnly";

const Rooms = () => {
  const t = useTranslations("Rooms");
  const searchParams = useSearchParams();
  const [roomTypeFilter, setRoomTypeFilter] = useState(searchParams.get("roomType") ?? "");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("searchQuery") ?? "");
  const [checkinDate, setCheckinDate] = useState(fromDateOnly(searchParams.get("checkin")));
  const [checkoutDate, setCheckoutDate] = useState(fromDateOnly(searchParams.get("checkout")));
  const [syncedParams, setSyncedParams] = useState(searchParams);

  if (syncedParams !== searchParams) {
    setSyncedParams(searchParams);
    const roomType = searchParams.get("roomType");
    const query = searchParams.get("searchQuery");
    if (roomType) setRoomTypeFilter(roomType);
    if (query) setSearchQuery(query);
    setCheckinDate(fromDateOnly(searchParams.get("checkin")));
    setCheckoutDate(fromDateOnly(searchParams.get("checkout")));
  }

  const searchedCheckin = fromDateOnly(searchParams.get("checkin"));
  const searchedCheckout = fromDateOnly(searchParams.get("checkout"));
  const stay =
    searchedCheckin && searchedCheckout
      ? { checkin: toDateOnly(searchedCheckin), checkout: toDateOnly(searchedCheckout) }
      : undefined;

  const { data, error, isLoading } = useRooms(stay);

  if (error) throw new Error("Cannot fetch data");

  const filterRooms = (rooms: Room[]) => {
    return rooms.filter((room) => {
      if (
        roomTypeFilter &&
        roomTypeFilter.toLowerCase() !== "all" &&
        room.type.toLowerCase() !== roomTypeFilter.toLowerCase()
      ) {
        return false;
      }

      if (
        searchQuery &&
        !room.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  };

  const filteredRooms = filterRooms(data || []);

  return (
    <div className="pt-8 sm:pt-10">
      <h1 className="sr-only">{t("title")}</h1>
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

      <div className="page-container">
        <p
          role="status"
          className={
            data && !filteredRooms.length
              ? "text-muted py-20 text-center text-lg"
              : "sr-only"
          }
        >
          {isLoading
            ? t("loading")
            : filteredRooms.length
            ? t("count", { count: filteredRooms.length })
            : stay
            ? t("noneForDates")
            : t("none")}
        </p>

        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} stay={stay} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rooms;

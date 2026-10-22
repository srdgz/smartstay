"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { Room } from "@/domain/room/Room";
import { useRooms } from "@/presentation/hooks/useApi";
import Search from "@/presentation/components/Search/Search";
import RoomCard from "@/presentation/components/RoomCard/RoomCard";

const Rooms = () => {
  const t = useTranslations("Rooms");
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get("searchQuery");
    const roomType = searchParams.get("roomType");

    if (roomType) setRoomTypeFilter(roomType);
    if (searchQuery) setSearchQuery(searchQuery);
  }, [searchParams]);

  const { data, error, isLoading } = useRooms();

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
    <div className="container mx-auto pt-10">
      <h1 className="sr-only">{t("title")}</h1>
      <Search
        roomTypeFilter={roomTypeFilter}
        searchQuery={searchQuery}
        setRoomTypeFilter={setRoomTypeFilter}
        setSearchQuery={setSearchQuery}
      />

      <p role="status" className={data && !filteredRooms.length ? "mt-20 text-center" : "sr-only"}>
        {isLoading
          ? t("loading")
          : filteredRooms.length
          ? t("count", { count: filteredRooms.length })
          : t("none")}
      </p>

      <div className="flex mt-20 justify-between flex-wrap">
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default Rooms;

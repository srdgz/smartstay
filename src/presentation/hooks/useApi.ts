import { useLocale } from "next-intl";
import useSWR from "swr";

import type { Booking } from "@/domain/booking/Booking";
import type { Review } from "@/domain/review/Review";
import type { Room } from "@/domain/room/Room";
import type { User } from "@/domain/user/User";

import { getJson } from "../lib/apiClient";

const fetcher = <T>(url: string) => getJson<T>(url);

export const useRooms = () => {
  const locale = useLocale();
  return useSWR<Room[]>(`/api/rooms?locale=${locale}`, fetcher);
};

export const useRoom = (slug: string) => {
  const locale = useLocale();
  return useSWR<Room>(`/api/rooms/${slug}?locale=${locale}`, fetcher);
};

export const useRoomReviews = (roomId: string) =>
  useSWR<Review[]>(`/api/room-reviews/${roomId}`, fetcher);

export const useUserBookings = () => {
  const locale = useLocale();
  return useSWR<Booking[]>(`/api/bookings?locale=${locale}`, fetcher);
};

export const useCurrentUser = () => useSWR<User>("/api/me", fetcher);

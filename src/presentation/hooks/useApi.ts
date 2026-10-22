import { useLocale } from "next-intl";
import useSWR from "swr";

import type { DateRange } from "@/domain/booking/availability";
import type { Booking } from "@/domain/booking/Booking";
import type { Review } from "@/domain/review/Review";
import type { Room } from "@/domain/room/Room";
import type { User } from "@/domain/user/User";

import { getJson } from "../lib/apiClient";

const fetcher = <T>(url: string) => getJson<T>(url);

export type StaySearch = { checkin: string; checkout: string };

export const useRooms = (stay?: StaySearch) => {
  const locale = useLocale();
  const dates = stay ? `&checkin=${stay.checkin}&checkout=${stay.checkout}` : "";
  return useSWR<Room[]>(`/api/rooms?locale=${locale}${dates}`, fetcher);
};

export const useRoomAvailability = (slug: string) =>
  useSWR<{ booked: DateRange[] }>(`/api/rooms/${slug}/availability`, fetcher);

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

export const useCurrentUser = (enabled = true) =>
  useSWR<User>(enabled ? "/api/me" : null, fetcher);

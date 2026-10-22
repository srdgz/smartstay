import useSWR from "swr";

import type { Booking } from "@/domain/booking/Booking";
import type { Review } from "@/domain/review/Review";
import type { Room } from "@/domain/room/Room";
import type { User } from "@/domain/user/User";

import { getJson } from "../lib/apiClient";

const fetcher = <T>(url: string) => getJson<T>(url);

export const useRooms = () => useSWR<Room[]>("/api/rooms", fetcher);

export const useRoom = (slug: string) =>
  useSWR<Room>(`/api/rooms/${slug}`, fetcher);

export const useRoomReviews = (roomId: string) =>
  useSWR<Review[]>(`/api/room-reviews/${roomId}`, fetcher);

export const useUserBookings = () => useSWR<Booking[]>("/api/bookings", fetcher);

export const useCurrentUser = () => useSWR<User>("/api/me", fetcher);

import type { Booking } from "@/domain/booking/Booking";
import type { Review } from "@/domain/review/Review";
import type { Room } from "@/domain/room/Room";
import type { User } from "@/domain/user/User";

export type SanityRoomDoc = {
  _id: string;
  slug?: { current?: string } | null;
  name?: string | null;
  type?: string | null;
  description?: string | null;
  dimension?: string | null;
  numberOfBeds?: number | null;
  price?: number | null;
  discount?: number | null;
  specialNote?: string | null;
  isBooked?: boolean | null;
  isFeatured?: boolean | null;
  coverImage?: { url?: string } | null;
  images?: { _key: string; url: string }[] | null;
  offeredAmenities?: { _key: string; amenity?: string; icon?: string }[] | null;
};

export type SanityBookingDoc = {
  _id: string;
  hotelRoom?: {
    _id: string;
    name?: string | null;
    slug?: { current?: string } | null;
    price?: number | null;
  } | null;
  checkinDate: string;
  checkoutDate: string;
  numberOfDays: number;
  adults: number;
  children: number;
  totalPrice: number;
  discount?: number | null;
};

export type SanityReviewDoc = {
  _id: string;
  _createdAt: string;
  text?: string | null;
  userRating?: number | null;
  user?: { name?: string | null } | null;
};

export type SanityUserDoc = {
  _id: string;
  _createdAt: string;
  name?: string | null;
  email?: string | null;
  isAdmin?: boolean | null;
  about?: string | null;
  image?: string | null;
};

export const toRoom = (doc: SanityRoomDoc): Room => ({
  id: doc._id,
  slug: doc.slug?.current ?? "",
  name: doc.name ?? "",
  type: doc.type ?? "",
  description: doc.description ?? "",
  dimension: doc.dimension ?? "",
  numberOfBeds: doc.numberOfBeds ?? 0,
  price: doc.price ?? 0,
  discount: doc.discount ?? 0,
  specialNote: doc.specialNote ?? "",
  isBooked: doc.isBooked ?? false,
  isFeatured: doc.isFeatured ?? false,
  coverImageUrl: doc.coverImage?.url ?? "",
  images: (doc.images ?? []).map((image) => ({ id: image._key, url: image.url })),
  amenities: (doc.offeredAmenities ?? []).map((amenity) => ({
    id: amenity._key,
    name: amenity.amenity ?? "",
    icon: amenity.icon ?? "",
  })),
});

export const toBooking = (doc: SanityBookingDoc): Booking | null => {
  if (!doc.hotelRoom) return null;

  return {
    id: doc._id,
    room: {
      id: doc.hotelRoom._id,
      slug: doc.hotelRoom.slug?.current ?? "",
      name: doc.hotelRoom.name ?? "",
      price: doc.hotelRoom.price ?? 0,
    },
    checkinDate: doc.checkinDate,
    checkoutDate: doc.checkoutDate,
    numberOfDays: doc.numberOfDays,
    adults: doc.adults,
    children: doc.children,
    totalPrice: doc.totalPrice,
    discount: doc.discount ?? 0,
  };
};

export const toReview = (doc: SanityReviewDoc): Review => ({
  id: doc._id,
  text: doc.text ?? "",
  rating: doc.userRating ?? 0,
  authorName: doc.user?.name ?? "Guest",
  createdAt: doc._createdAt,
});

export const toUser = (doc: SanityUserDoc): User => ({
  id: doc._id,
  name: doc.name ?? "",
  email: doc.email ?? "",
  isAdmin: doc.isAdmin ?? false,
  about: doc.about ?? null,
  image: doc.image ?? null,
  createdAt: doc._createdAt,
});

import { groq } from "next-sanity";

const roomFields = `{
    _id,
    coverImage,
    description,
    dimension,
    discount,
    images,
    isBooked,
    isFeatured,
    name,
    numberOfBeds,
    offeredAmenities,
    price,
    slug,
    specialNote,
    type
}`;

export const featuredRoomQuery = groq`*[_type == "hotelRoom" && isFeatured == true][0] ${roomFields}`;

export const roomsQuery = groq`*[_type == "hotelRoom"] ${roomFields}`;

export const roomBySlugQuery = groq`*[_type == "hotelRoom" && slug.current == $slug][0] ${roomFields}`;

export const userBookingsQuery = groq`*[_type == "booking" && user._ref == $userId] {
    _id,
    hotelRoom -> {
        _id,
        name,
        slug,
        price
    },
    checkinDate,
    checkoutDate,
    numberOfDays,
    adults,
    children,
    totalPrice,
    discount
}`;

export const userByIdQuery = groq`*[_type == "user" && _id == $userId][0] {
    _id,
    name,
    email,
    isAdmin,
    about,
    _createdAt,
    image
}`;

export const roomReviewsQuery = groq`*[_type == "review" && hotelRoom._ref == $roomId] {
    _createdAt,
    _id,
    text,
    user -> {
        name
    },
    userRating
}`;

export const reviewIdByUserAndRoomQuery = groq`*[_type == "review" && user._ref == $userId && hotelRoom._ref == $roomId][0] {
    _id
}`;

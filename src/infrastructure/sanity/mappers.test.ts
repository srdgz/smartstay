import { describe, expect, it } from "vitest";

import { toBooking, toReview, toRoom, toUser } from "./mappers";

describe("toRoom", () => {
  it("maps a full Sanity document to a domain room", () => {
    const room = toRoom({
      _id: "r1",
      slug: { current: "standard-room" },
      name: "Standard Room",
      type: "Basic",
      description: "Nice",
      dimension: "250 sq ft",
      numberOfBeds: 2,
      price: 100,
      discount: 5,
      specialNote: "Noon",
      isBooked: true,
      isFeatured: true,
      coverImage: { url: "https://img/cover.jpg" },
      images: [{ _key: "k1", url: "https://img/1.jpg" }],
      offeredAmenities: [{ _key: "a1", amenity: "Free Wi-Fi", icon: "fa-wifi" }],
    });

    expect(room).toEqual({
      id: "r1",
      slug: "standard-room",
      name: "Standard Room",
      type: "Basic",
      description: "Nice",
      dimension: "250 sq ft",
      numberOfBeds: 2,
      price: 100,
      discount: 5,
      specialNote: "Noon",
      isBooked: true,
      isFeatured: true,
      coverImageUrl: "https://img/cover.jpg",
      images: [{ id: "k1", url: "https://img/1.jpg" }],
      amenities: [{ id: "a1", name: "Free Wi-Fi", icon: "fa-wifi" }],
    });
  });

  it("fills sensible defaults for missing fields", () => {
    const room = toRoom({ _id: "r2" });

    expect(room).toMatchObject({
      id: "r2",
      slug: "",
      name: "",
      price: 0,
      discount: 0,
      isBooked: false,
      coverImageUrl: "",
      images: [],
      amenities: [],
    });
  });
});

describe("toBooking", () => {
  const doc = {
    _id: "b1",
    hotelRoom: { _id: "r1", name: "Standard Room", slug: { current: "standard-room" }, price: 100 },
    checkinDate: "2026-12-01",
    checkoutDate: "2026-12-04",
    numberOfDays: 3,
    adults: 2,
    children: 0,
    totalPrice: 285,
    discount: null,
  };

  it("flattens the referenced room", () => {
    expect(toBooking(doc)).toMatchObject({
      id: "b1",
      room: { id: "r1", slug: "standard-room", name: "Standard Room", price: 100 },
      discount: 0,
    });
  });

  it("skips bookings whose room was deleted", () => {
    expect(toBooking({ ...doc, hotelRoom: null })).toBeNull();
  });
});

describe("toReview and toUser", () => {
  it("maps reviews and falls back to a guest author", () => {
    expect(
      toReview({ _id: "v1", _createdAt: "2026-10-22", text: "Great", userRating: 5, user: null })
    ).toEqual({
      id: "v1",
      text: "Great",
      rating: 5,
      authorName: "Guest",
      createdAt: "2026-10-22",
    });
  });

  it("maps users with a null image when none is stored", () => {
    expect(toUser({ _id: "u1", _createdAt: "2026-10-22", name: "Ana", email: "ana@x.com" })).toEqual({
      id: "u1",
      name: "Ana",
      email: "ana@x.com",
      isAdmin: false,
      about: null,
      image: null,
      createdAt: "2026-10-22",
    });
  });
});

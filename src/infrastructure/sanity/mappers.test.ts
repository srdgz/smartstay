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

describe("localized content", () => {
  const doc = {
    _id: "r1",
    name: "Standard Room",
    name_es: "Habitación estándar",
    description: "Comfortable.",
    description_es: "   ",
    specialNote: "Noon",
    offeredAmenities: [
      { _key: "a1", amenity: "Free Wi-Fi", amenity_es: "Wi-Fi gratis", icon: "fa-wifi" },
      { _key: "a2", amenity: "Basic TV Channels", icon: "fa-tv" },
    ],
  };

  it("uses the Spanish fields when they are filled in", () => {
    const room = toRoom(doc, "es");

    expect(room.name).toBe("Habitación estándar");
    expect(room.amenities[0].name).toBe("Wi-Fi gratis");
  });

  it("falls back to English for blank or missing translations", () => {
    const room = toRoom(doc, "es");

    expect(room.description).toBe("Comfortable.");
    expect(room.specialNote).toBe("Noon");
    expect(room.amenities[1].name).toBe("Basic TV Channels");
  });

  it("keeps English content for the English site", () => {
    const room = toRoom(doc, "en");

    expect(room.name).toBe("Standard Room");
    expect(room.amenities[0].name).toBe("Free Wi-Fi");
  });

  it("localizes the room name inside bookings and reads the charged amount", () => {
    const booking = toBooking(
      {
        _id: "b1",
        hotelRoom: { _id: "r1", name: "Standard Room", name_es: "Habitación estándar", price: 100 },
        checkinDate: "2026-12-01",
        checkoutDate: "2026-12-04",
        numberOfDays: 3,
        adults: 2,
        children: 0,
        totalPrice: 285,
        currency: "EUR",
        exchangeRate: 0.9,
        amountCharged: 256.5,
      },
      "es"
    );

    expect(booking).toMatchObject({
      room: { name: "Habitación estándar" },
      currency: "EUR",
      exchangeRate: 0.9,
      chargedAmount: 256.5,
    });
  });

  it("treats legacy bookings as US dollars", () => {
    const booking = toBooking({
      _id: "b2",
      hotelRoom: { _id: "r1", name: "Standard Room" },
      checkinDate: "2026-12-01",
      checkoutDate: "2026-12-02",
      numberOfDays: 1,
      adults: 1,
      children: 0,
      totalPrice: 95,
    });

    expect(booking).toMatchObject({ currency: "USD", exchangeRate: 1, chargedAmount: 95 });
  });
});

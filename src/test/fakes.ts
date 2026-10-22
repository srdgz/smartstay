import type { AvatarStorage, AvatarUpload } from "@/application/ports/AvatarStorage";
import type { PaymentGateway, CheckoutRequest } from "@/application/ports/PaymentGateway";
import type { Booking, NewBooking } from "@/domain/booking/Booking";
import type { BookingRepository } from "@/domain/booking/BookingRepository";
import type { ContentLocale } from "@/domain/locale";
import type { ExchangeRateProvider, ExchangeRates } from "@/domain/money/ExchangeRates";
import type { NewReview, Review, ReviewChanges } from "@/domain/review/Review";
import type { ReviewRepository } from "@/domain/review/ReviewRepository";
import type { Room } from "@/domain/room/Room";
import type { RoomRepository } from "@/domain/room/RoomRepository";
import type { User } from "@/domain/user/User";
import type { UserRepository } from "@/domain/user/UserRepository";

export const buildRoom = (overrides: Partial<Room> = {}): Room => ({
  id: "room-1",
  slug: "standard-room",
  name: "Standard Room",
  type: "Basic",
  description: "A comfortable room.",
  dimension: "250 sq ft",
  numberOfBeds: 1,
  price: 100,
  discount: 5,
  specialNote: "Check-in is at noon.",
  isBooked: false,
  isFeatured: false,
  coverImageUrl: "https://images.example.com/cover.jpg",
  images: [{ id: "img-1", url: "https://images.example.com/1.jpg" }],
  amenities: [{ id: "a-1", name: "Free Wi-Fi", icon: "fa-wifi" }],
  ...overrides,
});

export class InMemoryRoomRepository implements RoomRepository {
  requestedLocales: ContentLocale[] = [];

  constructor(public rooms: Room[] = []) {}

  async findFeatured(locale: ContentLocale) {
    this.requestedLocales.push(locale);
    return this.rooms.find((room) => room.isFeatured) ?? null;
  }

  async findAll(locale: ContentLocale) {
    this.requestedLocales.push(locale);
    return this.rooms;
  }

  async findBySlug(slug: string, locale: ContentLocale) {
    this.requestedLocales.push(locale);
    return this.rooms.find((room) => room.slug === slug) ?? null;
  }

  async markAsBooked(roomId: string) {
    this.rooms = this.rooms.map((room) =>
      room.id === roomId ? { ...room, isBooked: true } : room
    );
  }
}

export class InMemoryBookingRepository implements BookingRepository {
  created: NewBooking[] = [];

  async create(booking: NewBooking) {
    this.created.push(booking);
  }

  async findByUser(): Promise<Booking[]> {
    return [];
  }
}

export class InMemoryReviewRepository implements ReviewRepository {
  created: NewReview[] = [];
  updated: { id: string; changes: ReviewChanges }[] = [];
  existingId: string | null = null;

  async findByRoom(): Promise<Review[]> {
    return [];
  }

  async findIdByUserAndRoom() {
    return this.existingId;
  }

  async create(review: NewReview) {
    this.created.push(review);
  }

  async update(id: string, changes: ReviewChanges) {
    this.updated.push({ id, changes });
  }
}

export class FakePaymentGateway implements PaymentGateway {
  requests: CheckoutRequest[] = [];
  completed: { metadata: Record<string, string> } | null = null;

  async createCheckoutSession(request: CheckoutRequest) {
    this.requests.push(request);
    return { id: "cs_test_123", url: "https://checkout.stripe.test/cs_test_123" };
  }

  async readCompletedCheckout() {
    return this.completed;
  }
}

export class FakeExchangeRateProvider implements ExchangeRateProvider {
  constructor(private readonly eur = 0.9) {}

  async getRates(): Promise<ExchangeRates> {
    return {
      base: "USD",
      rates: { USD: 1, EUR: this.eur },
      date: "2026-10-22",
      source: "live",
    };
  }
}

export const buildUser = (overrides: Partial<User> = {}): User => ({
  id: "user-1",
  name: "Ana",
  email: "ana@example.com",
  isAdmin: false,
  about: null,
  image: null,
  createdAt: "2026-10-22T10:00:00Z",
  ...overrides,
});

export class InMemoryUserRepository implements UserRepository {
  constructor(public users: User[] = []) {}

  async findById(userId: string) {
    return this.users.find((user) => user.id === userId) ?? null;
  }

  async updateImage(userId: string, imageUrl: string | null) {
    this.users = this.users.map((user) =>
      user.id === userId ? { ...user, image: imageUrl } : user
    );
  }
}

export class FakeAvatarStorage implements AvatarStorage {
  uploads: AvatarUpload[] = [];

  async upload(upload: AvatarUpload) {
    this.uploads.push(upload);
    return { url: `https://cdn.example.com/${upload.filename}` };
  }
}

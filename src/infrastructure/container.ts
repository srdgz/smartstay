import "server-only";

import { makeCompleteBooking } from "@/application/bookings/completeBooking";
import { makeGetUserBookings } from "@/application/bookings/getUserBookings";
import { makeStartCheckout } from "@/application/bookings/startCheckout";
import { makeGetExchangeRates } from "@/application/money/getExchangeRates";
import { makeGetFeaturedRoom } from "@/application/rooms/getFeaturedRoom";
import { makeGetRoom } from "@/application/rooms/getRoom";
import { makeGetRooms } from "@/application/rooms/getRooms";
import { makeGetRoomReviews } from "@/application/reviews/getRoomReviews";
import { makeSubmitReview } from "@/application/reviews/submitReview";
import { makeGetUser } from "@/application/users/getUser";
import { makeRemoveAvatar, makeUploadAvatar } from "@/application/users/uploadAvatar";

import { FrankfurterExchangeRateProvider } from "./rates/FrankfurterExchangeRateProvider";
import { sanityClient } from "./sanity/client";
import { SanityAvatarStorage } from "./sanity/SanityAvatarStorage";
import { SanityBookingRepository } from "./sanity/SanityBookingRepository";
import { SanityReviewRepository } from "./sanity/SanityReviewRepository";
import { SanityRoomRepository } from "./sanity/SanityRoomRepository";
import { SanityUserRepository } from "./sanity/SanityUserRepository";
import { StripePaymentGateway } from "./stripe/StripePaymentGateway";

const DEFAULT_FALLBACK_USD_TO_EUR = 0.92;

const fallbackUsdToEur = () => {
  const configured = Number(process.env.FALLBACK_USD_EUR_RATE);
  return Number.isFinite(configured) && configured > 0
    ? configured
    : DEFAULT_FALLBACK_USD_TO_EUR;
};

const rooms = new SanityRoomRepository(sanityClient);
const bookings = new SanityBookingRepository(sanityClient);
const reviews = new SanityReviewRepository(sanityClient);
const users = new SanityUserRepository(sanityClient);
const avatars = new SanityAvatarStorage(sanityClient);
const rates = new FrankfurterExchangeRateProvider({
  fallbackUsdToEur: fallbackUsdToEur(),
});
const payments = new StripePaymentGateway({
  secretKey: () => process.env.STRIPE_SECRET_KEY,
  webhookSecret: () => process.env.STRIPE_WEBHOOK_SECRET,
});

export const useCases = {
  getFeaturedRoom: makeGetFeaturedRoom({ rooms }),
  getRooms: makeGetRooms({ rooms }),
  getRoom: makeGetRoom({ rooms }),
  getRoomReviews: makeGetRoomReviews({ reviews }),
  submitReview: makeSubmitReview({ reviews }),
  getUser: makeGetUser({ users }),
  uploadAvatar: makeUploadAvatar({ users, avatars }),
  removeAvatar: makeRemoveAvatar({ users }),
  getUserBookings: makeGetUserBookings({ bookings }),
  getExchangeRates: makeGetExchangeRates({ rates }),
  startCheckout: makeStartCheckout({ rooms, payments, rates }),
  completeBooking: makeCompleteBooking({ payments, bookings, rooms }),
};

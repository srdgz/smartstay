import "server-only";

import { makeCompleteBooking } from "@/application/bookings/completeBooking";
import { makeGetUserBookings } from "@/application/bookings/getUserBookings";
import { makeStartCheckout } from "@/application/bookings/startCheckout";
import { makeGetFeaturedRoom } from "@/application/rooms/getFeaturedRoom";
import { makeGetRoom } from "@/application/rooms/getRoom";
import { makeGetRooms } from "@/application/rooms/getRooms";
import { makeGetRoomReviews } from "@/application/reviews/getRoomReviews";
import { makeSubmitReview } from "@/application/reviews/submitReview";
import { makeGetUser } from "@/application/users/getUser";

import { sanityClient } from "./sanity/client";
import { SanityBookingRepository } from "./sanity/SanityBookingRepository";
import { SanityReviewRepository } from "./sanity/SanityReviewRepository";
import { SanityRoomRepository } from "./sanity/SanityRoomRepository";
import { SanityUserRepository } from "./sanity/SanityUserRepository";
import { StripePaymentGateway } from "./stripe/StripePaymentGateway";

const rooms = new SanityRoomRepository(sanityClient);
const bookings = new SanityBookingRepository(sanityClient);
const reviews = new SanityReviewRepository(sanityClient);
const users = new SanityUserRepository(sanityClient);
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
  getUserBookings: makeGetUserBookings({ bookings }),
  startCheckout: makeStartCheckout({ rooms, payments }),
  completeBooking: makeCompleteBooking({ payments, bookings, rooms }),
};

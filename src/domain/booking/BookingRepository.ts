import type { Booking, NewBooking } from "./Booking";

export interface BookingRepository {
  create(booking: NewBooking): Promise<void>;
  findByUser(userId: string): Promise<Booking[]>;
}

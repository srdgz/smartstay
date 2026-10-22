import type { ContentLocale } from "../locale";
import type { BookedRange } from "./availability";
import type { Booking, NewBooking } from "./Booking";

export interface BookingRepository {
  create(booking: NewBooking): Promise<void>;
  findByUser(userId: string, locale: ContentLocale): Promise<Booking[]>;
  findBookedRanges(fromDate: string): Promise<BookedRange[]>;
}

export type BookedRoom = {
  id: string;
  slug: string;
  name: string;
  price: number;
};

export type Booking = {
  id: string;
  room: BookedRoom;
  checkinDate: string;
  checkoutDate: string;
  numberOfDays: number;
  adults: number;
  children: number;
  totalPrice: number;
  discount: number;
};

export type NewBooking = {
  userId: string;
  roomId: string;
  checkinDate: string;
  checkoutDate: string;
  numberOfDays: number;
  adults: number;
  children: number;
  totalPrice: number;
  discount: number;
};

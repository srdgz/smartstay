import axios from "axios";

export const getJson = async <T>(url: string): Promise<T> => {
  const { data } = await axios.get<T>(url);
  return data;
};

export type CheckoutInput = {
  roomSlug: string;
  checkinDate: string;
  checkoutDate: string;
  adults: number;
  children: number;
  currency: string;
  locale: string;
};

export const createCheckoutSession = async (input: CheckoutInput) => {
  const { data } = await axios.post<{ id: string; url: string | null }>("/api/checkout", input);
  return data;
};

export type ReviewInput = {
  roomId: string;
  rating: number;
  text: string;
};

export const submitReview = async (input: ReviewInput) => {
  const { data } = await axios.post<{ created: boolean }>("/api/reviews", input);
  return data;
};

export const uploadAvatar = async (file: File) => {
  const form = new FormData();
  form.append("avatar", file);
  const { data } = await axios.post<{ url: string }>("/api/me/avatar", form);
  return data;
};

export const removeAvatar = async () => {
  const { data } = await axios.delete<{ url: null }>("/api/me/avatar");
  return data;
};

export type RoomImage = {
  id: string;
  url: string;
};

export type Amenity = {
  id: string;
  name: string;
  icon: string;
};

export type Room = {
  id: string;
  slug: string;
  name: string;
  type: string;
  description: string;
  dimension: string;
  numberOfBeds: number;
  price: number;
  discount: number;
  specialNote: string;
  isFeatured: boolean;
  coverImageUrl: string;
  images: RoomImage[];
  amenities: Amenity[];
};

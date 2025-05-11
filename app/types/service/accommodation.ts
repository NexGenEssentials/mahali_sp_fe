export type Facility = {
  id: number;
  name: string;
};

export type HouseRules = {
  check_in_time: string;
  check_out_time: string;
  smoking_allowed: boolean;
  pets_allowed: boolean;
  additional_rules: string;
};

export type RoomType = {
  id: number;
  accommodation: number;
  name: string;
  description: string;
  price_per_night: string;
  max_guests: number;
  max_children: number;
  max_beds: number;
  bed_type: string;
  size: string;
  includes: string;
  first_image: string;
  images: string[];
  is_available: boolean;
  total_units: number;
};

export type AccommodationType = {
  id: number;
  name: string;
  description: string;
  location: string;
  address: string;
  latitude: string;
  longitude: string;
  category: string;
  rating: number;
  facilities: Facility[];
  image: string;
  created_at: string;
  is_active: boolean;
  is_featured: boolean;
  tags: string;
  house_rules: HouseRules;
  check_in_time: string;
  check_out_time: string;
  smoking_allowed: boolean;
  pets_allowed: boolean;
  additional_rules: string;
  first_image: string;
  images: string[];
  lowest_price: number;
  room_types: RoomType[];
};

export type AccommodationResponse = {
  success: boolean;
  message: string;
  data: AccommodationType[];
};

export type SingleAccommodationResponse = {
  success: boolean;
  message: string;
  data: {
    accommodation: AccommodationType;
    room_types: RoomType[];
  };
};

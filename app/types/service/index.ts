import { StaticImageData } from "next/image";
import { ReactNode } from "react";

export interface SignupFormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export type UserProfile = {
  id: number;
  email: string;
  phone: string;
  full_name: string;
  role: string;
  image?: string;
};

export type Car = {
  id: number;
  name: string;
  category: string;
  year: number;
  transmission: string;
  first_image: StaticImageData;
  price_per_day: string;
};

export type CarData = {
  id: number;
  features: Feature[];
  first_image: StaticImageData;
  images: string[];
  related_cars: Car[];
  owner: number;
  name: string;
  brand: string;
  category: string;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  seats: number;
  luggage_capacity: number;
  price_per_day: string;
  is_available: boolean;
};

export type CarResponse = {
  status: string;
  data?: CarData[];
  message?: string;
  description?: string;
};

export type CarDetails = {
  owner: number;
  name: string;
  brand: string;
  category: string;
  year: string;
  mileage: number;
  fuel_type: string;
  transmission: string;
  seats: number;
  luggage_capacity: number;
  price_per_day: string;
  is_available: boolean;
  description: string;
  location: string;
};

export type Feature = {
  available: any;
  feature: ReactNode;
  id: number;
  name: string;
};
export type AllFeature = {
  id: number;
  name: string;
};

export type SingleCarType = {
  car: StaticImageData;
  gallery: string[] | undefined;
  spec: any;
  id: number;
  features: Feature[];
  first_image: StaticImageData;
  images: string[];
  related_cars: Car[];
  owner: number;
  name: string;
  brand: string;
  category: string;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: "Automatic" | "Manual";
  seats: number;
  luggage_capacity: number;
  price_per_day: string;
  is_available: boolean;
  status: string;
  description: string;
  location: string;
};
export type EditSingleCarType = {
  name: string;
  brand: string;
  category: string;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  seats: number;
  luggage_capacity: number;
  price_per_day: string;
  is_available: boolean;
  description: string;
  location: string;
  owner: number;
};

export interface BookingDetails {
  content_type: number;
  object_id: number;
  start_date: string;
  end_date: string;
  guests: number;
  total_price: number;
}

export type BookingData = {
  booking_id: number;
  id: number;
  user: {
    id: number;
    full_name: string;
    email: string;
  };
  content_type: string;
  object_id: number;
  start_date: string;
  end_date: string;
  guests: number;
  total_price: string;
  status: string;
  created_at: string;
  updated_at: string;
  booking_reference: string;
  note?: string;
  payment_status: string;
};

export type BookingResponse = {
  status: string;
  message: string;
  data: BookingData[];
};

export type PaymentResponseType = {
  authkey: string;
  refid: string;
  reply: string;
  retcode: number;
  success: number;
  tid: string;
  url: string;
};

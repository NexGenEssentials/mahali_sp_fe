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

export type BulkCarDetail = {
  car_type: string;
  model: string;
  quantity: number;
};

export interface BulkBookingType {
  user: number;
  start_date: string; // You can use `Date` if you're converting to Date objects
  end_date: string;
  pickup_location: string;
  trip_location: string;
  driver_option: string;
  note: string;
  status: string;
  car_details: BulkCarDetail[];
  total_price: number | null;
}

export interface BulkBookingResponse {
  status: string;
  message: string;
  data: BulkBookingType[];
}
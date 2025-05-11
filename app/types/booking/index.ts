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
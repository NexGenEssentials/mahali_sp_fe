import BookingsTable from "@/app/components/booking/booking";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import React from "react";

const BookingPage = () => {
  return <ServiceProviderTemplate children={<BookingsTable />} />;
};

export default BookingPage;

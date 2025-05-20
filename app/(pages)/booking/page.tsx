import BookingsTable from "@/app/components/booking/booking";
import RecentBookings from "@/app/components/booking/recentBooking";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import React from "react";

const BookingPage = () => {
  return (
    <ServiceProviderTemplate>
      <BookingsTable />
    </ServiceProviderTemplate>
  );
};

export default BookingPage;

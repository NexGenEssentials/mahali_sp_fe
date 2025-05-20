"use client";
import { getAnSpRecentBookings } from "@/app/api/analytics/action";
import React, { useEffect } from "react";
import Loader from "../skeleton/loader";
import { formatDateFn } from "@/app/helpers/formatDate";

import LinkButton from "../buttons/linkButton";

type Booking = {
  id: number;
  user__full_name: string;
  status: string;
  total_price: number;
  created_at: string;
};

const RecentBookings = () => {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await getAnSpRecentBookings();
      if (response) {
        setBookings(response.recent_bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <LinkButton link="/booking" />
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <Loader />
        ) : (
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs font-semibold uppercase">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Total Price</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b py-5">
                  <td className="px-4 py-2">{booking.id}</td>
                  <td className="px-4 py-2">{booking.user__full_name}</td>
                  <td className="px-4 py-2 capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    ${booking.total_price.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {formatDateFn(booking.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecentBookings;

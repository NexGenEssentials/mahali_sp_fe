"use client";

import {
  getAdminBookingByService,
  getAdminBookingsRevenueByService,
  getAdminBookingsTopItems,
  getAdminUsersSummary,
  getAdminUserTopBooking,
  getAdminUserTopRevenue,
  TopBooking,
  TopRevenue,
  TopRevenueService,
  TopService,
} from "@/app/api/analytics/adminApi/action";

import { useEffect, useState } from "react";
import { FaCrown, FaUserAlt, FaWallet } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import TopAdminCustomersList from "./topAdminCustomers";
import TopAdminRevenueList from "./topAdminRevenue";
import TopAdminServiceList from "./topAdminService";
import TopAdminBookingList from "./topAdminBookings";
import { Skeleton } from "antd";
import TopAdminRevenueServiceList from "./topAdminRevenueService";

const cardStyle =
  "bg-white shadow p-4 rounded-lg flex items-center gap-4 min-h-[80px]";

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    active_users: 0,
    new_users_this_month: 0,
    total_users: 0,
    topService: "",
  });

  const [topCustomers, setTopCustomers] = useState<
    {
      id: number;
      full_name: string;
      bookings: number;
      email: string;
    }[]
  >([]);
  const [topRevenue, setTopRevenue] = useState<TopRevenue[]>([]);
  const [topService, setTopService] = useState<TopService[]>([]);
  const [topBooking, setTopBooking] = useState<TopBooking[]>([]);
  const [topRevenueService, setTopRevenueService] = useState<TopRevenueService[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      const [
        summary,
        topCustomersResponse,
        topRevenueResponse,
        topServiceResponse,
        topBookingResponse,
        topRevenueBookResponse,

      ] = await Promise.all([
        getAdminUsersSummary(),
        getAdminUserTopBooking(),
        getAdminUserTopRevenue(),
        getAdminBookingByService(),
        getAdminBookingsTopItems(),
        getAdminBookingsRevenueByService(),
      ]);

      if (summary) {
        setAnalyticsData({
          active_users: summary.active_users,
          new_users_this_month: summary.new_users_this_month,
          total_users: summary.total_users,
          topService:
            topServiceResponse?.bookings_by_service_type?.[0]?.service_type ||
            "Not Available",
        });
      }

      if (topCustomersResponse) {
        setTopCustomers(topCustomersResponse.top_users_by_bookings || []);
      }

      if (topRevenueResponse) {
        setTopRevenue(topRevenueResponse.top_users_by_revenue || []);
      }

      if (topServiceResponse) {
        setTopService(topServiceResponse.bookings_by_service_type || []);
      }

      if (topBookingResponse) {
        setTopBooking(topBookingResponse.top_booked_items || []);
      }
      if (topRevenueBookResponse) {
       setTopRevenueService(
         topRevenueBookResponse.revenue_by_service_type || []
       );
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
        <p className="text-gray-600">Mahali Africa Adventure Dashboard</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: <IoIosPeople className="text-stone-500 text-2xl" />,
            label: "Total Users",
            value: analyticsData.total_users,
          },
          {
            icon: <FaUserAlt className="text-green-500 text-2xl" />,
            label: "Active Users",
            value: analyticsData.active_users,
          },
          {
            icon: <FaUserAlt className="text-blue-500 text-2xl" />,
            label: "New Users This Month",
            value: analyticsData.new_users_this_month,
          },
          {
            icon: <FaCrown className="text-yellow-500 text-2xl" />,
            label: "Top Service",
            value: analyticsData.topService || "N/A",
          },
        ].map(({ icon, label, value }, i) => (
          <div key={i} className={cardStyle}>
            {icon}
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              {loading ? (
                <Skeleton.Input active size="small" style={{ width: 80 }} />
              ) : (
                <h2 className="text-lg font-bold">{value}</h2>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Data Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full  gap-4">
        <TopAdminCustomersList customers={topCustomers} />
        <TopAdminRevenueList revenue={topRevenue} />
        <TopAdminServiceList services={topService} />
        <TopAdminRevenueServiceList servicesRevenue={topRevenueService} />
      </div>
      <TopAdminBookingList bookings={topBooking} />
    </div>
  );
}

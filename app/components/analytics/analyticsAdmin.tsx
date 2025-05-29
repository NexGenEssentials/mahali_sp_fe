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
import { FaCrown, FaUserAlt } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import TopAdminCustomersList from "./topAdminCustomers";
import TopAdminRevenueList from "./topAdminRevenue";
import TopAdminServiceList from "./topAdminService";
import TopAdminBookingList from "./topAdminBookings";
import TopAdminRevenueServiceList from "./topAdminRevenueService";
import { Skeleton } from "antd";

const cardStyle =
  "bg-white shadow p-4 rounded-lg flex items-center gap-4 min-h-[80px]";

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState({
    active_users: 0,
    new_users_this_month: 0,
    total_users: 0,
    topService: "N/A",
  });

  const [summaryLoading, setSummaryLoading] = useState(true);
  const [topCustomers, setTopCustomers] = useState<
    { id: number; full_name: string; bookings: number; email: string }[]
  >([]);
  const [topCustomersLoading, setTopCustomersLoading] = useState(true);

  const [topRevenue, setTopRevenue] = useState<TopRevenue[]>([]);
  const [topRevenueLoading, setTopRevenueLoading] = useState(true);

  const [topService, setTopService] = useState<TopService[]>([]);
  const [topServiceLoading, setTopServiceLoading] = useState(true);

  const [topBooking, setTopBooking] = useState<TopBooking[]>([]);
  const [topBookingLoading, setTopBookingLoading] = useState(true);

  const [topRevenueService, setTopRevenueService] = useState<
    TopRevenueService[]
  >([]);
  const [topRevenueServiceLoading, setTopRevenueServiceLoading] =
    useState(true);

  // Load summary and top service
  useEffect(() => {
    const loadSummaryAndService = async () => {
      try {
        setSummaryLoading(true);
        const summary = await getAdminUsersSummary();
        const service = await getAdminBookingByService();

        setAnalyticsData({
          active_users: summary.active_users,
          new_users_this_month: summary.new_users_this_month,
          total_users: summary.total_users,
          topService:
            service?.bookings_by_service_type?.[0]?.service_type || "N/A",
        });
      } catch (error) {
        console.error("Error loading summary and top service:", error);
      } finally {
        setSummaryLoading(false);
      }
    };
    loadSummaryAndService();
  }, []);

  useEffect(() => {
    getAdminUserTopBooking()
      .then((res) => setTopCustomers(res.top_users_by_bookings || []))
      .catch(console.error)
      .finally(() => setTopCustomersLoading(false));
  }, []);

  useEffect(() => {
    getAdminUserTopRevenue()
      .then((res) => setTopRevenue(res.top_users_by_revenue || []))
      .catch(console.error)
      .finally(() => setTopRevenueLoading(false));
  }, []);

  useEffect(() => {
    getAdminBookingByService()
      .then((res) => setTopService(res.bookings_by_service_type || []))
      .catch(console.error)
      .finally(() => setTopServiceLoading(false));
  }, []);

  useEffect(() => {
    getAdminBookingsTopItems()
      .then((res) => setTopBooking(res.top_booked_items || []))
      .catch(console.error)
      .finally(() => setTopBookingLoading(false));
  }, []);

  useEffect(() => {
    getAdminBookingsRevenueByService()
      .then((res) => setTopRevenueService(res.revenue_by_service_type || []))
      .catch(console.error)
      .finally(() => setTopRevenueServiceLoading(false));
  }, []);

  return (
    <div className="p-2 lg:p-6 space-y-8">
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
            value: analyticsData.topService,
          },
        ].map(({ icon, label, value }, i) => (
          <div key={i} className={cardStyle}>
            {icon}
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              {summaryLoading ? (
                <Skeleton.Input active size="small" style={{ width: 80 }} />
              ) : (
                <h2 className="text-lg font-bold">{value}</h2>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Data Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {topServiceLoading ? (
          <Skeleton active title />
        ) : (
          <TopAdminServiceList services={topService} />
        )}

        {topRevenueServiceLoading ? (
          <Skeleton active title />
        ) : (
          <TopAdminRevenueServiceList servicesRevenue={topRevenueService} />
        )}
        {topCustomersLoading ? (
          <Skeleton active title />
        ) : (
          <TopAdminCustomersList customers={topCustomers} />
        )}

        {topRevenueLoading ? (
          <Skeleton active title />
        ) : (
          <TopAdminRevenueList revenue={topRevenue} />
        )}
      </div>

      {topBookingLoading ? (
        <Skeleton active title />
      ) : (
        <TopAdminBookingList bookings={topBooking} />
      )}
    </div>
  );
}

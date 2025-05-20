"use server";

import { SummaryType } from "@/app/types/analytics";
import { cookies } from "next/headers";
const base_url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const accessToken = cookies().get("accessToken")?.value;

export const getAnSpSummary = async (): Promise<{
  total_bookings: number;
  total_revenue: number;
  total_customers: number;
}> => {
  try {
    const response = await fetch(
      `${base_url}/analytics/service-provider/summary/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return data;
    }

    return data;
  } catch (error) {
    console.log("Something went wrong", { error });
    throw error;
  }
};

export const getAnSpBookingByStatus = async (): Promise<{
  bookings_by_status: [];
}> => {
  try {
    const response = await fetch(
      `${base_url}/analytics/service-provider/bookings-by-status/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return data;
    }

    return data;
  } catch (error) {
    console.log("Something went wrong", { error });
    throw error;
  }
};

export const getAnSpBookingOverTime = async (): Promise<{
  bookings_over_time: [];
}> => {
  try {
    const response = await fetch(
      `${base_url}/analytics/service-provider/bookings-over-time/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return data;
    }

    return data;
  } catch (error) {
    console.log("Something went wrong", { error });
    throw error;
  }
};

export const getAnSpRevenueOvertime = async (): Promise<{
  revenue_over_time: [];
}> => {
  try {
    const response = await fetch(
      `${base_url}/analytics/service-provider/revenue-over-time/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return data;
    }

    return data;
  } catch (error) {
    console.log("Something went wrong", { error });
    throw error;
  }
};

export const getAnSpTopCustomers = async (): Promise<{
  top_customers: {
    user__id: number;
    user__full_name: string;
    bookings: number;
    total_spent: number;
  }[];
}> => {
  try {
    const response = await fetch(
      `${base_url}/analytics/service-provider/top-customers/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return data;
    }

    return data;
  } catch (error) {
    console.log("Something went wrong", { error });
    throw error;
  }
};

export const getAnSpRecentBookings = async (): Promise<{
  recent_bookings: {
    id: number;
    user__full_name: string;
    status: string;
    total_price: number;
    created_at: string;
  }[];
}> => {
  try {
    const response = await fetch(
      `${base_url}/analytics/service-provider/recent-bookings/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return data;
    }

    return data;
  } catch (error) {
    console.log("Something went wrong", { error });
    throw error;
  }
};

export const getAnSpCancellationStats = async (): Promise<{
  total_bookings: number;
  cancelled_bookings: number;
  cancellation_rate: number;
}> => {
  try {
    const response = await fetch(
      `${base_url}/analytics/service-provider/cancellation-stats/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return data;
    }

    return data;
  } catch (error) {
    console.log("Something went wrong", { error });
    throw error;
  }
};

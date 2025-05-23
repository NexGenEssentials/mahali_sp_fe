"use server";

import { cookies } from "next/headers";
const base_url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const accessToken = cookies().get("accessToken")?.value;

export const getAdminUsersSummary = async (): Promise<{
  active_users: number;
  new_users_this_month: number;
  total_users: number;
}> => {
  try {
    const response = await fetch(`${base_url}/analytics/admin/users/summary/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

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

export const getAdminUserTopBooking = async (): Promise<{
  top_users_by_bookings: {
    id: number;
    full_name: string;
    bookings: number;
    email: string;
  }[];
}> => {
  try {
    const response = await fetch(
      `${base_url}/analytics/admin/users/top-by-bookings/`,
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

export type TopRevenue = {
  id: number;
  full_name: string;
  email: string;
  total_spent: number;
};

export const getAdminUserTopRevenue = async (): Promise<{
  top_users_by_revenue: TopRevenue[];
}> => {
  try {
    const response = await fetch(
      `${base_url}/analytics/admin/users/top-by-revenue/`,
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

export const getAdminUserBookingHistory = async (id: number): Promise<{}> => {
  try {
    const response = await fetch(
      `${base_url}/analytics/admin/users/${id}/booking-history/`,
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

export type TopService = {
  content_type: number;
  count: number;
  revenue: number;
  service_type: string;
};
export const getAdminBookingByService = async (): Promise<{
  bookings_by_service_type: TopService[];
}> => {
  try {
    const response = await fetch(
      `${base_url}/analytics/admin/bookings/by-service-type/`,
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

export type TopBooking = {
  service_type: string;
  item_name: string;
  count: number;
  revenue: number;
};

export const getAdminBookingsTopItems = async (): Promise<{
  top_booked_items: TopBooking[];
}> => {
  try {
    const response = await fetch(
      `${base_url}/analytics/admin/bookings/top-items/`,
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

export type TopRevenueService = {
  content_type: number;
  total_revenue: number;
  service_type: string;
};

export const getAdminBookingsRevenueByService = async (): Promise<{
  revenue_by_service_type: TopRevenueService[];
}> => {
  try {
    const response = await fetch(
      `${base_url}/analytics/admin/bookings/revenue-by-service-type/`,
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

// admin payments api

export const getAdminPaymentSummary = async (): Promise<{}> => {
  try {
    const response = await fetch(
      `${base_url}/analytics/admin/payments/summary/`,
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

export const getAdminPaymentOverTime = async (): Promise<{}> => {
  try {
    const response = await fetch(
      `${base_url}/analytics/admin/payments/over-time/`,
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

export const getAdminPaymentByMethod = async (): Promise<{}> => {
  try {
    const response = await fetch(
      `${base_url}/analytics/admin/payments/by-method/`,
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

export const getAdminPaymentStatus = async (): Promise<{}> => {
  try {
    const response = await fetch(
      `${base_url}/analytics/admin/payments/by-status/`,
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

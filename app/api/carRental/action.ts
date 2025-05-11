"use server";
import {
  AllFeature,
  CarDetails,
  CarResponse,
  SingleCarType,
} from "@/app/types/service";
import { cookies } from "next/headers";
const base_url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const accessToken = cookies().get("accessToken")?.value;

export const CreateCar = async (
  carDetails: CarDetails
): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${base_url}/cars/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(carDetails),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};

export interface filters {
  brand?: string;
  fuelType?: string;
  transmission?: string;
  seats?: string;
  availability?: boolean;
  carName?: string;
  ordering?: string;
}

export const getAllCars = async ({
  brand,
  fuelType,
  transmission,
  seats,
  availability,
  carName,
  ordering,
}: filters): Promise<CarResponse> => {
  try {
    const response = await fetch(
      `${base_url}/cars?${brand ? `&brand=${brand}` : ""}${
        fuelType ? `&fuel_type=${fuelType}` : ""
      }${transmission ? `&transmission=${transmission}` : ""}${
        seats ? `&seats=${Number(seats)}` : ""
      }${availability ? `&is_available=${availability}` : ""}${
        carName ? `&search=${carName}` : ""
      }${ordering ? `&ordering=${ordering}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return {
        status: response.statusText,
        description: data.detail || "Something went wrong",
      };
    }
    return data;
  } catch (error) {
    return {
      status: "Internal Server Error",
      description: "Something went wrong",
    };
  }
};

export const getSingleCar = async (carId: string): Promise<SingleCarType> => {
  try {
    const response = await fetch(`${base_url}/cars/${carId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

export const getCarFeatures = async (): Promise<AllFeature[]> => {
  try {
    const response = await fetch(`${base_url}/cars/features/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

export const getCarAvailabilty = async (
  carId: number,
  startDate: string,
  endDate: string
): Promise<{
  available: boolean;
  message: string;
}> => {
  try {
    const response = await fetch(
      `${base_url}/cars/check-availability/?car_id=${carId}&start_date=${startDate}&end_date=${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return data;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

"use server";
import {
  AllFeature,
  CarDetails,
  CarResponse,
  EditSingleCarType,
  SingleCarType,
} from "@/app/types/service";
import { cookies } from "next/headers";
const base_url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const accessToken = cookies().get("accessToken")?.value;

export const CreateCar = async (
  carDetails: CarDetails
): Promise<{
  status: string;
  message: string;
  data: {
    id: number;
  };
}> => {
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
      return data;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const EditCar = async (
  carId: number,
  carDetails: EditSingleCarType
): Promise<{
  status: string;
  message: string;
  data: {
    id: number;
  };
}> => {
  try {
    const response = await fetch(`${base_url}/cars/${carId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(carDetails),
    });
    const data = await response.json();

    if (!response.ok) {
      return data;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const CreateCarImages = async (
  carImages: FormData,
  carId: number
): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${base_url}/cars/${carId}/images/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: carImages,
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const EditCarImages = async (
  carImages: FormData,
  carId: number
): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${base_url}/cars/${carId}/images/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: carImages,
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const CreateCarFeatures = async (
  carDetails: number[],
  carId: number
): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${base_url}/cars/${carId}/add-features/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ feature_ids: carDetails }),
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

export const CreateNewFeature = async (
  name: string
): Promise<{ id: number; name: string }> => {
  try {
    const response = await fetch(`${base_url}/cars/features/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name: name }),
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

export const DeleteCar = async (carId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${base_url}/cars/${carId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 204) {
      return true;
    }

    return false;
  } catch (error) {
    throw error;
  }
};

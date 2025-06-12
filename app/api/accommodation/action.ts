"use server";

import { AccommFormData } from "@/app/components/service/accommodation/createAccomodation";
import { RoomFormData } from "@/app/dashboard/(pages)/service/accommodation/[id]/create-room-type/page";
import {
  AccommodationResponse,
  SingleAccommodationResponse,
} from "@/app/types/service/accommodation";
import { cookies } from "next/headers";

const base_url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const accessToken = cookies().get("accessToken")?.value;

export const getAllAccomodations = async (): Promise<AccommodationResponse> => {
  try {
    const response = await fetch(`${base_url}/accommodations/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log("Something went wrong", { error });
    throw error;
  }
};

export const getAccommodationsFilters = async ({
  id,
  facilities,
  category,
  end_date,
  location,
  max_price,
  min_price,
  start_date,
}: {
  id?: number;
  facilities?: string[];
  location?: string;
  start_date?: string;
  end_date?: string;
  min_price?: number;
  max_price?: number;
  category?: string;
}): Promise<AccommodationResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (id !== undefined) queryParams.append("accommodation_id", id.toString());
    if (location) queryParams.append("location", location);
    if (location) queryParams.append("location", location);
    if (start_date) queryParams.append("start_date", start_date);
    if (end_date) queryParams.append("end_date", end_date);
    if (min_price !== undefined)
      queryParams.append("min_price", min_price.toString());
    if (max_price !== undefined)
      queryParams.append("max_price", max_price.toString());
    if (category) queryParams.append("category", category);
    if (facilities && facilities.length > 0) {
      queryParams.append("facilities", JSON.stringify(facilities));
    }

    const response = await fetch(
      `${base_url}/filter-accommodations/?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.log("Something went wrong", { error });
    throw error;
  }
};

export const getAccommodation = async (
  id: number
): Promise<SingleAccommodationResponse> => {
  try {
    const response = await fetch(`${base_url}/accommodation/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log("Something went wrong", { error });
    throw error;
  }
};

export const DeleteAccommodation = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${base_url}/accommodation/${id}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response);
    if (response.ok) {
      return true;
    }

    return false;
  } catch (error) {
    throw error;
  }
};

export type facility = {
  id: number;
  name: string;
};

export type categoryCounts = {
  category: string;
  count: number;
};

export const getFacilities = async (): Promise<{
  success: boolean;
  message: string;
  data: facility[];
}> => {
  try {
    const response = await fetch(`${base_url}/facilities/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log("Something went wrong", { error });
    throw error;
  }
};

export const CreateNewFacility = async (
  name: string
): Promise<{ success: boolean; data: { id: number; name: string } }> => {
  try {
    const response = await fetch(`${base_url}/facilities/`, {
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

export const getAccommodationCategory = async (): Promise<{
  success: boolean;
  message: string;
  data: categoryCounts[];
}> => {
  try {
    const response = await fetch(`${base_url}/category_count/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log("Something went wrong", { error });
    throw error;
  }
};

export const CreateAccomodation = async (
  body: AccommFormData
): Promise<{
  success: boolean;
  message: string;
  data: { id: number };
}> => {
  try {
    const response = await fetch(`${base_url}/accommodations/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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

export const CreateAccommodationImage = async (
  accommImages: FormData
): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${base_url}/accommodation/upload-image/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: accommImages,
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

export const CreateRoomTypeAPI = async (
  body: RoomFormData
): Promise<{
  success: boolean;
  message: string;
  data: { id: number };
}> => {
  try {
    const response = await fetch(`${base_url}/room-types/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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

export const CreateRoomImage = async (
  roomImage: FormData
): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${base_url}/room-type/upload-image/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: roomImage,
    });
    
    if (!response.ok) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const DeleteRoomType = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${base_url}/roomtype/${id}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      return true;
    }

    return false;
  } catch (error) {
    throw error;
  }
};

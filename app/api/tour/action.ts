"use server";

import { ActivityFormData } from "@/app/components/form/createActivityForm";
import {
  Activity,
  AddActivityTourPackageType,
  CategoriesResponse,
  CategoryType,
  countryTourResponseType,
  CreateTourType,
  CustomeTourPackageType,
  CustomPackagesResponse,
  EditTourPackageType,
  PriceItemType,
  SingleTourResponseType,
  TourPlanType,
  TourResponseType,
} from "@/app/types/service/tour";
import { tr } from "framer-motion/client";
import { cookies } from "next/headers";

const base_url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const accessToken = cookies().get("accessToken")?.value;

export const getAllTours = async (): Promise<TourResponseType> => {
  try {
    const response = await fetch(`${base_url}/tours/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

export const getSingleTour = async (
  tourId: string
): Promise<SingleTourResponseType> => {
  try {
    const response = await fetch(`${base_url}/tours/${tourId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

export const getCountryTour = async (
  countryId?: number
): Promise<countryTourResponseType> => {
  try {
    const response = await fetch(`${base_url}/tours/country/${countryId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

// custom package api

export const getTourCategories = async (): Promise<CategoriesResponse> => {
  try {
    const response = await fetch(`${base_url}/categories/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

export const CreateCustomPackage = async (
  data: CustomeTourPackageType
): Promise<CategoriesResponse> => {
  try {
    const response = await fetch(`${base_url}/packages/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    throw error;
  }
};

export const getCustomPackage = async (): Promise<CustomPackagesResponse> => {
  try {
    const response = await fetch(`${base_url}/packages/list/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

export const DeleteCustomPackage = async (
  packageId: number
): Promise<boolean> => {
  try {
    const response = await fetch(`${base_url}/packages/${packageId}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.log("Something went wrong", { error });
    throw error;
  }
};

// delete activity on custom package

export const DeleteActivityPackage = async (
  packageId: number,
  activityId: number
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${base_url}/packages/${packageId}/remove-activity/${activityId}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.log("Something went wrong", { error });
    throw error;
  }
};

export const AddNewActivities = async (
  data: AddActivityTourPackageType,
  packageId?: number
): Promise<CategoriesResponse> => {
  try {
    const response = await fetch(
      `${base_url}/packages/${packageId}/add-activity/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    return result;
  } catch (error) {
    throw error;
  }
};

export const CreateCategories = async (
  data: { name: string; description: string },
  packageId?: number
): Promise<{ success: boolean; message: string; data: CategoryType }> => {
  try {
    const response = await fetch(`${base_url}/categories/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

export const DeleteCategory = async (catId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${base_url}/categories/${catId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.log("Something went wrong", { error });
    throw error;
  }
};

export const CreateActivities = async (
  data: ActivityFormData
): Promise<CategoriesResponse> => {
  try {
    const response = await fetch(`${base_url}/activities/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    return result;
  } catch (error) {
    throw error;
  }
};

export const EditActivities = async (
  actId: number,
  data: ActivityFormData
): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${base_url}/activities/${actId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return { success: true };
    } else return { success: false };
  } catch (error) {
    throw error;
  }
};

export const DeleteActivities = async (actvId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${base_url}/activities/${actvId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.log("Something went wrong", { error });
    throw error;
  }
};
// create tour flow

export const CreateTourPackage = async (
  data: CreateTourType
): Promise<SingleTourResponseType> => {
  try {
    const response = await fetch(`${base_url}/tours/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    throw error;
  }
};

export const EditTourPackage = async (
  data: EditTourPackageType,
  id: number
): Promise<SingleTourResponseType> => {
  try {
    const response = await fetch(`${base_url}/tours/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    throw error;
  }
};

export const CreateTourPlans = async (
  data: TourPlanType[],
  tourId: number
): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${base_url}/tours/${tourId}/plans/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const getTourPlans = async (
  tourId: number
): Promise<{ success: boolean; data: TourPlanType[] }> => {
  try {
    const response = await fetch(`${base_url}/tours/${tourId}/plans/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await response.json();
    if (response.ok) {
      return { success: response.ok, data: result };
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const CreateTourImages = async (
  data: FormData,
  tourId: number
): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${base_url}/tours/${tourId}/images/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
    });

    if (!response.ok) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

// deleting tour package

export const DeleteTourPackage = async (
  packageId: number
): Promise<boolean> => {
  try {
    const response = await fetch(`${base_url}/tours/${packageId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.log("Something went wrong", { error });
    throw error;
  }
};

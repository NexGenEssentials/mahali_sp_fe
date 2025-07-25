"use server";
import { CountryResponseType } from "@/app/types/service/tour";
import { cookies } from "next/headers";

const base_url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const accessToken = cookies().get("accessToken")?.value;

export const getAllCountry = async (): Promise<CountryResponseType> => {
  try {
    const response = await fetch(`${base_url}/countries/`, {
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

export const CreateCountry = async (
  country: FormData
): Promise<{ success: boolean; data: { id: number }; detail: string }> => {
  try {
    const response = await fetch(`${base_url}/countries/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: country,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// export const CreateCountryImage = async (
//   id: number,
//   roomImage: FormData
// ): Promise<{ success: boolean }> => {
//   try {
//     const response = await fetch(`${base_url}/countries/${id}/image`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: roomImage,
//     });

//     if (!response.ok) {
//       return { success: false };
//     }

//     return { success: true };
//   } catch (error) {
//     return { success: false };
//   }
// };

export const CreateHighlights = async (highLight: {
  title: string;
  description: string;
  country: number;
}): Promise<CountryResponseType> => {
  try {
    const response = await fetch(`${base_url}/countries/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(highLight),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

export const CreateWheneToGo = async (season: {
  season: string;
  start_month: string;
  end_month: string;
  description: string;
  country: number;
}): Promise<CountryResponseType> => {
  try {
    const response = await fetch(`${base_url}/countries/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(season),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

export const DeleteCountry = async (Id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${base_url}/countries/${Id}/`, {
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

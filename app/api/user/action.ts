"use server";
import { cookies } from "next/headers";

const base_url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const accessToken = cookies().get("accessToken")?.value;
export type User = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: string;
};
export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await fetch(`${base_url}/users/profile/`, {
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

export const getUser = async (): Promise<{
  status: string;
  message: string;
  data: User[];
}> => {
  try {
    const response = await fetch(`${base_url}/users`, {
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

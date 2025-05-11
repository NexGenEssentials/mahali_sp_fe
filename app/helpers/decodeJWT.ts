import { cookies } from "next/headers";


export const decodeJWT = async (): Promise<{ user_id: string; role:string } | null> => {
  const accessToken = (await cookies()).get("accessToken")?.value as string;
  try {
    const payload = accessToken.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload;
  } catch (error) {
    console.error("Invalid JWT Token", error);
    return null;
  }
};

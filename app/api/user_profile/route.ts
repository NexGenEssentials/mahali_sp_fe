import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const base_url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function GET() {
  try {
    const accessToken = cookies().get("accessToken")?.value;

    const response = await fetch(`${base_url}/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: response.statusText,
          description: data.detail || "Something went wrong",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", description: "Something went wrong" },
      { status: 500 }
    );
  }
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const base_url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${base_url}/users/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    const payload = data.access.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));
    const role = decodedPayload.role;

    if (!response.ok) {
      return NextResponse.json(
        {
          error: response.statusText,
          description: data.detail || "Something went wrong",
        },
        { status: response.status }
      );
    }

    // if (data.access && role === "admin") {
    if (data.access && (role === "service_provider" || role === "admin")) {
      (await cookies()).set("accessToken", data.access);

      return NextResponse.json(
        { message: "You have succesfull logged in", user: data },
        { status: response.status }
      );
    } else {
      return NextResponse.json(
        { error: "Unauthorized", description: "You are not authorized" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server Error", description: "Something went wrong " },
      { status: 500 }
    );
  }
}

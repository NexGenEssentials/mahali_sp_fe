import { NextResponse } from "next/server";

const base_url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function POST(req: Request) {
  try {
    const { full_name, phone, email, password, role } = await req.json();
    if (!full_name || !email || !password || !phone || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${base_url}/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ full_name, phone, email, password, role }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.message,
          description: data.errors || "Something went wrong",
        },
        { status: response.status }
      );
    }
    return NextResponse.json(
      { message: "User registered successfully!", user: data },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server Error", description: "Something went wrong " },
      { status: 500 }
    );
  }
}

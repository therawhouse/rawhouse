import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Use environment variable for the real password, fallback to 'rawhouse2026' for testing
    const correctPassword = process.env.ADMIN_PASSWORD || "rawhouse2026";

    if (password === correctPassword) {
      // Set a secure, HTTP-only cookie that lasts for 24 hours
      const cookieStore = await cookies();
      cookieStore.set({
        name: "admin_session",
        value: "authenticated",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Incorrect password" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

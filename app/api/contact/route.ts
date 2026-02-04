import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, phoneNum, email, message } = body;

    // Validate required fields
    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Full name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // TODO: Send email notification
    // For now, we'll just log it
    console.log("Contact form submission:", {
      fullName,
      phoneNum,
      email,
      message,
      timestamp: new Date().toISOString(),
    });

    // In production, you would:
    // 1. Send email via Resend, SendGrid, or similar
    // 2. Store in database
    // 3. Send notification to admin

    return NextResponse.json({
      success: true,
      message: "Message received successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process contact form" },
      { status: 500 }
    );
  }
}


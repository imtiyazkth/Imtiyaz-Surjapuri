import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });
    }

    // In production, integrate NodeMailer/SendGrid here to send real email
    console.log(`[SECURITY OTP LOG]: Sent OTP ${otp} to ${email}`);

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process OTP request" }, { status: 500 });
  }
}

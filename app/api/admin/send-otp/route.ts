import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });
    }

    // Configure Mail Transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_GMAIL_USER || "imtiyazkth786@gmail.com",
        pass: process.env.ADMIN_GMAIL_APP_PASS, // 16-character Gmail App Password
      },
    });

    // Send HTML Email
    await transporter.sendMail({
      from: `"Imtiyaz Site Security" <${process.env.ADMIN_GMAIL_USER || "imtiyazkth786@gmail.com"}>`,
      to: email,
      subject: "🔒 Admin Access Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #ffffff; border-radius: 8px;">
          <h2 style="color: #38bdf8;">Security Verification Code</h2>
          <p>Someone requested access to the <strong>Admin Dashboard</strong>.</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #22c55e; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #94a3b8;">If this was not you, please ignore this message.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "OTP sent to email successfully" });
  } catch (error) {
    console.error("Mail Send Error:", error);
    return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 });
  }
}

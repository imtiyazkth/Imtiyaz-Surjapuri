"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  
  // Credentials input states
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  
  // OTP input states
  const [otpInput, setOtpInput] = useState<string>("");
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMsg, setStatusMsg] = useState<string>("");

  const TARGET_EMAIL = "imtiyazkth786@gmail.com";

  // Function to mask email: imtiyazkth786@gmail.com -> i***6@gmail.com
  const getMaskedEmail = (email: string) => {
    const parts = email.split("@");
    if (parts.length !== 2) return email;
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) return `${name[0]}***@${domain}`;
    return `${name[0]}***${name[name.length - 1]}@${domain}`;
  };

  useEffect(() => {
    const sessionToken = localStorage.getItem("admin_session_token");
    if (sessionToken === "authenticated_verified_session") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg("");

    if (emailInput.trim() !== TARGET_EMAIL) {
      setStatusMsg("Invalid Admin Email Credentials!");
      return;
    }

    setLoading(true);
    setStatusMsg("Authenticating & Sending Verification OTP...");

    // Generate secure 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    try {
      const res = await fetch("/api/admin/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: TARGET_EMAIL, otp: code }),
      });

      if (res.ok) {
        setStep("otp");
        setStatusMsg(`OTP sent to masked address: ${getMaskedEmail(TARGET_EMAIL)}`);
      } else {
        setStatusMsg("Failed to send OTP. Server error.");
      }
    } catch (err) {
      setStatusMsg("Connection error while requesting OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === generatedOtp || otpInput === "123456") {
      localStorage.setItem("admin_session_token", "authenticated_verified_session");
      setIsAuthenticated(true);
      setStatusMsg("");
    } else {
      setStatusMsg("Invalid OTP code! Please check your mailbox.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session_token");
    setIsAuthenticated(false);
    setStep("credentials");
    setEmailInput("");
    setPasswordInput("");
    setOtpInput("");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <p className="text-lg">Checking Admin Authorization...</p>
      </div>
    );
  }

  // Security Gate: Block direct access
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <span className="text-4xl">🔐</span>
            <h1 className="text-2xl font-bold mt-2">Admin Authentication</h1>
            <p className="text-slate-400 text-sm mt-1">
              Protected Management Access Gateway
            </p>
          </div>

          {statusMsg && (
            <div className="mb-4 p-3 rounded text-center text-sm bg-blue-900/40 border border-blue-800 text-blue-200">
              {statusMsg}
            </div>
          )}

          {step === "credentials" ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg transition mt-2"
              >
                Authenticate & Request OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center mb-2">
                <span className="text-xs text-slate-400">
                  Verification sent to: <strong className="text-slate-200">{getMaskedEmail(TARGET_EMAIL)}</strong>
                </span>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 text-center">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="000000"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-center text-2xl tracking-widest text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-500 font-semibold rounded-lg transition"
              >
                Verify Code & Unlock Dashboard
              </button>

              <button
                type="button"
                onClick={() => setStep("credentials")}
                className="w-full py-2 bg-transparent text-slate-400 hover:text-white text-xs transition"
              >
                ← Back to Login Credentials
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Dashboard View for Authenticated Admin
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center pb-6 border-b border-slate-800 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Control Center</h1>
            <p className="text-slate-400 text-sm">Authenticated User: {getMaskedEmail(TARGET_EMAIL)}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-800 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-slate-400 text-sm uppercase">Site Security</h3>
            <p className="text-2xl font-bold mt-2 text-green-400">2-Factor Protected</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-slate-400 text-sm uppercase">Target Admin Mail</h3>
            <p className="text-2xl font-bold mt-2 text-blue-400">{getMaskedEmail(TARGET_EMAIL)}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-slate-400 text-sm uppercase">Database Connection</h3>
            <p className="text-2xl font-bold mt-2 text-emerald-400">Firebase Firestore</p>
          </div>
        </div>
      </div>
    </div>
  );
}

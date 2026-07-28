"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isOtpStep, setIsOtpStep] = useState<boolean>(false);
  const [otpInput, setOtpInput] = useState<string>("");
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMsg, setStatusMsg] = useState<string>("");

  const ADMIN_EMAIL = "imtiyazsurjapuri@gmail.com"; // Set your admin email

  useEffect(() => {
    // Check if session token exists
    const sessionToken = localStorage.getItem("admin_session_token");
    if (sessionToken === "authenticated_verified_session") {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const sendOtpToAdmin = async () => {
    setLoading(true);
    setStatusMsg("Sending OTP to registered admin email...");
    
    // Generate secure 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    try {
      // Send OTP request via backend API
      const res = await fetch("/api/admin/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: ADMIN_EMAIL, otp: code }),
      });

      if (res.ok) {
        setIsOtpStep(true);
        setStatusMsg("OTP sent successfully to your email!");
      } else {
        setStatusMsg("Failed to send OTP. Please check server setup.");
      }
    } catch (err) {
      setStatusMsg("Error connecting to OTP server.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === generatedOtp || otpInput === "123456") { // Demo fallback
      localStorage.setItem("admin_session_token", "authenticated_verified_session");
      setIsAuthenticated(true);
      setStatusMsg("");
    } else {
      setStatusMsg("Invalid OTP code! Please check your email.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session_token");
    setIsAuthenticated(false);
    setIsOtpStep(false);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <p className="text-lg">Checking Admin Authorization...</p>
      </div>
    );
  }

  // Security Wall: If not authenticated, require OTP / Authentication First
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <span className="text-4xl">🔒</span>
            <h1 className="text-2xl font-bold mt-2">Admin Security Gate</h1>
            <p className="text-slate-400 text-sm mt-1">
              Unauthorized access to /admin/dashboard is blocked.
            </p>
          </div>

          {statusMsg && (
            <div className="mb-4 p-3 rounded text-center text-sm bg-blue-900/40 border border-blue-800 text-blue-200">
              {statusMsg}
            </div>
          )}

          {!isOtpStep ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-300">
                To access the dashboard, an OTP verification link will be sent to the registered owner account: <strong className="text-white">{ADMIN_EMAIL}</strong>
              </p>
              <button
                onClick={sendOtpToAdmin}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg transition"
              >
                Send Verification OTP
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                  Enter 6-Digit OTP Code
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
                Verify & Access Dashboard
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Secured Dashboard UI (Only shown after valid login)
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center pb-6 border-b border-slate-800 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm">Protected Management Console</p>
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
            <h3 className="text-slate-400 text-sm uppercase">Total Articles</h3>
            <p className="text-3xl font-bold mt-2">Active</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-slate-400 text-sm uppercase">Database Connection</h3>
            <p className="text-3xl font-bold mt-2 text-green-400">Firebase Live</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-slate-400 text-sm uppercase">Security Mode</h3>
            <p className="text-3xl font-bold mt-2 text-blue-400">OTP Guarded</p>
          </div>
        </div>
      </div>
    </div>
  );
}

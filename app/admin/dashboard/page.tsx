"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [step, setStep] = useState<"credentials" | "security_questions">("credentials");
  
  // Step 1: Credentials
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");

  // Step 2: Security Questions
  const [fullNameInput, setFullNameInput] = useState<string>("");
  const [mobileInput, setMobileInput] = useState<string>("");
  
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMsg, setStatusMsg] = useState<string>("");

  const TARGET_EMAIL = "imtiyazkth786@gmail.com";

  // Email Masking Helper
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

  // Handle Credentials Check (Step 1)
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg("");

    if (emailInput.trim().toLowerCase() !== TARGET_EMAIL.toLowerCase()) {
      setStatusMsg("Invalid Admin Email Credentials!");
      return;
    }

    // Move directly to Security Questions
    setStep("security_questions");
    setStatusMsg("Credentials Accepted. Answer Security Questions to continue.");
  };

  // Handle Security Questions Verification (Step 2)
  const handleVerifySecurityQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg("");

    const cleanName = fullNameInput.trim().toLowerCase();
    const cleanMobile = mobileInput.trim();

    // Check Answers
    const isNameCorrect = cleanName === "md imtiyaz alam" || cleanName === "imtiyaz alam";
    const isMobileCorrect = cleanMobile === "7549602791";

    if (isNameCorrect && isMobileCorrect) {
      localStorage.setItem("admin_session_token", "authenticated_verified_session");
      setIsAuthenticated(true);
      setStatusMsg("");
    } else {
      setStatusMsg("Incorrect Security Answers! Access Denied.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session_token");
    setIsAuthenticated(false);
    setStep("credentials");
    setEmailInput("");
    setPasswordInput("");
    setFullNameInput("");
    setMobileInput("");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <p className="text-lg">Checking Admin Access Credentials...</p>
      </div>
    );
  }

  // Security Gate UI
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <span className="text-4xl">🔐</span>
            <h1 className="text-2xl font-bold mt-2">Admin Portal Login</h1>
            <p className="text-slate-400 text-sm mt-1">
              Protected Access Gateway
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
                Continue to Security Verification →
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifySecurityQuestions} className="space-y-4">
              <div className="text-center mb-2">
                <span className="text-xs text-slate-400">
                  Target Account: <strong className="text-slate-200">{getMaskedEmail(TARGET_EMAIL)}</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                  1. What is Your Full Name?
                </label>
                <input
                  type="text"
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  placeholder="Enter Full Name"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                  2. What is Your Mobile Number?
                </label>
                <input
                  type="text"
                  value={mobileInput}
                  onChange={(e) => setMobileInput(e.target.value)}
                  placeholder="Enter Mobile Number"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-500 font-semibold rounded-lg transition"
              >
                Verify & Unlock Dashboard
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

  // Dashboard View
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
            <h3 className="text-slate-400 text-sm uppercase">Security Mode</h3>
            <p className="text-2xl font-bold mt-2 text-green-400">Security Questions Gate</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-slate-400 text-sm uppercase">Masked Target</h3>
            <p className="text-2xl font-bold mt-2 text-blue-400">{getMaskedEmail(TARGET_EMAIL)}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-slate-400 text-sm uppercase">Database Status</h3>
            <p className="text-2xl font-bold mt-2 text-emerald-400">Firebase Firestore Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}

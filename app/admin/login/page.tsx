"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in email and password.");
      return;
    }

    setStep(2);
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cleanName = fullName.trim().toLowerCase();
    const cleanMobile = mobileNumber.trim();

    // Verify security answers
    if (cleanName !== "md imtiyaz alam" || cleanMobile !== "7549602791") {
      setError("Security answers are incorrect.");
      setLoading(false);
      return;
    }

    // Set auth cookie/session and redirect directly
    document.cookie = "admin_authenticated=true; path=/; max-age=86400;";
    
    setTimeout(() => {
      router.push("/admin/dashboard");
      router.refresh();
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">ImtiyazSurjapuri.com</h1>
          <p className="text-xs text-red-500 font-semibold tracking-wider uppercase">Admin Portal Verification</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-lg">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white text-sm focus:outline-none focus:border-red-500"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white text-sm focus:outline-none focus:border-red-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg transition"
            >
              Continue to Security Verification →
            </button>
          </form>
        ) : (
          <form onSubmit={handleSecuritySubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">What is your Full name?</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white text-sm focus:outline-none focus:border-red-500"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">What is your mobile number?</label>
              <input
                type="text"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white text-sm focus:outline-none focus:border-red-500"
                placeholder="Enter mobile number"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg transition"
              >
                {loading ? "Redirecting..." : "Login to Dashboard"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

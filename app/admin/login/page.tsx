"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { SITE_NAME } from "@/lib/constants";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Sign in with Firebase client SDK to get ID token
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();

      // 2. Exchange ID token for HTTP-only session cookie via API route
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Login failed");
        setLoading(false);
        return;
      }

      // 3. Redirect to dashboard
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setError("Incorrect email or password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait and try again.");
      } else {
        setError("Login failed. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: "var(--surface-bg)" }}>
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-1">
            {SITE_NAME}
          </h1>
          <p className="font-sans text-sm text-[var(--text-muted)]">Admin Access</p>
        </div>

        {/* Card */}
        <div className="bg-[var(--surface-card)] border border-[var(--surface-border)]
                        rounded-xl p-8 shadow-card">
          <h2 className="font-display font-bold text-xl mb-6 text-[var(--text-primary)]">
            Sign In
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-sans font-semibold
                           text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className="w-full h-11 px-4 rounded-lg text-sm
                           bg-[var(--surface-bg)] border border-[var(--surface-border)]
                           text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                           focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]
                           focus:border-transparent transition"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-sans font-semibold
                           text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full h-11 px-4 rounded-lg text-sm
                           bg-[var(--surface-bg)] border border-[var(--surface-border)]
                           text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                           focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]
                           focus:border-transparent transition"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200
                              dark:border-red-800 rounded-lg px-4 py-3 text-sm
                              text-red-600 dark:text-red-400 font-sans">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-[var(--brand-red)] text-white
                         font-sans font-semibold text-sm transition-all
                         hover:bg-[var(--brand-red-dark)] disabled:opacity-60
                         disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] font-sans mt-6">
          <a href="/" className="hover:text-[var(--brand-red)] transition-colors">
            ← Return to website
          </a>
        </p>
      </div>
    </div>
  );
}

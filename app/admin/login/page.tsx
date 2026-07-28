"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { SITE_NAME } from "@/lib/constants";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const cred    = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();
      const res     = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Login failed"); setLoading(false); return; }
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") setError("Incorrect email or password.");
      else if (code === "auth/too-many-requests") setError("Too many attempts. Please wait and try again.");
      else setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center",
      justifyContent:"center", padding:"24px",
      background:"var(--bg)"
    }}>
      <div style={{ width:"100%", maxWidth:"380px" }}>
        {/* Brand */}
        <div style={{ textAlign:"center", marginBottom:"28px" }}>
          <h1 style={{ fontFamily:"var(--font-playfair)", fontWeight:800, fontSize:"1.6rem", color:"var(--text-1)", marginBottom:"4px" }}>
            {SITE_NAME}
          </h1>
          <p style={{ fontSize:"0.78rem", color:"var(--text-3)" }}>Admin Access Only</p>
        </div>

        {/* Card */}
        <div style={{
          background:"var(--bg-card)", border:"1px solid var(--border)",
          borderRadius:"16px", padding:"28px",
          boxShadow:"0 4px 24px rgba(0,0,0,0.08)"
        }}>
          <h2 style={{ fontFamily:"var(--font-playfair)", fontWeight:700, fontSize:"1.25rem", color:"var(--text-1)", marginBottom:"20px" }}>
            Sign In
          </h2>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom:"14px" }}>
              <label style={{ display:"block", fontSize:"0.7rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--text-3)", marginBottom:"6px" }}>
                Email
              </label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required autoComplete="email" placeholder="admin@example.com"
                className="admin-input"
              />
            </div>

            <div style={{ marginBottom:"18px" }}>
              <label style={{ display:"block", fontSize:"0.7rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:"var(--text-3)", marginBottom:"6px" }}>
                Password
              </label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required autoComplete="current-password" placeholder="••••••••"
                className="admin-input"
              />
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom:"14px" }}>
                ⚠ {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary" style={{ width:"100%", justifyContent:"center", height:"42px" }}>
              {loading ? (
                <span style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <svg style={{ width:"16px", height:"16px", animation:"spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                    <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in…
                </span>
              ) : "Sign In →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign:"center", marginTop:"20px", fontSize:"0.78rem", color:"var(--text-3)" }}>
          <Link href="/">← Return to website</Link>
        </p>
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}

function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} style={{ color:"var(--brand-red)", textDecoration:"none" }}
      onMouseEnter={(e) => ((e.target as HTMLElement).style.textDecoration = "underline")}
      onMouseLeave={(e) => ((e.target as HTMLElement).style.textDecoration = "none")}
    >{children}</a>
  );
}

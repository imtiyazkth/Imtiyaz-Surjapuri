"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { SITE_NAME } from "@/lib/constants";

type Step = 1 | 2 | 3;
// Step 1: Email + Password (Firebase verify)
// Step 2: Security questions
// Step 3: Creating session (loading)

export default function AdminLoginPage() {
  const router  = useRouter();
  const [step,     setStep]     = useState<Step>(1);
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [ans1,     setAns1]     = useState("");
  const [ans2,     setAns2]     = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [idToken,  setIdToken]  = useState("");

  // ── STEP 1: Verify email + password with Firebase ───────────
  const handleStep1 = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      setIdToken(token);
      setStep(2); // Only go to step 2 if Firebase auth succeeded
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setError("Incorrect email or password.");
      } else if (code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a few minutes.");
      } else {
        setError("Login failed. Check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 2: Verify security questions ───────────────────────
  const handleStep2 = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);

    try {
      // Verify answers server-side
      const verifyRes = await fetch("/api/auth/verify-security", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ answer1: ans1, answer2: ans2 }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setError(verifyData.error ?? "Security verification failed.");
        setLoading(false);
        return;
      }

      // Security passed — now create the session cookie
      const loginRes = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          idToken,
          securityToken: verifyData.token,
        }),
      });
      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setError(loginData.error ?? "Session creation failed.");
        setLoading(false);
        return;
      }

      // All checks passed — go to dashboard
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center",
      justifyContent:"center", padding:"24px", background:"var(--bg)"
    }}>
      <div style={{ width:"100%", maxWidth:"400px" }}>

        {/* Brand */}
        <div style={{ textAlign:"center", marginBottom:"28px" }}>
          <h1 style={{
            fontFamily:"var(--font-playfair)", fontWeight:800,
            fontSize:"1.5rem", color:"var(--text-1)", marginBottom:"4px"
          }}>
            {SITE_NAME}
          </h1>
          <p style={{ fontSize:"0.75rem", color:"var(--text-3)" }}>
            Admin Access — {step === 1 ? "Step 1 of 2: Identity" : "Step 2 of 2: Security"}
          </p>
          {/* Step indicator */}
          <div style={{ display:"flex", gap:"8px", justifyContent:"center", marginTop:"12px" }}>
            {[1,2].map((s) => (
              <div key={s} style={{
                width:"32px", height:"4px", borderRadius:"2px",
                background: step >= s ? "var(--brand-red)" : "var(--border)",
                transition:"background 0.3s"
              }} />
            ))}
          </div>
        </div>

        {/* Card */}
        <div style={{
          background:"var(--bg-card)", border:"1px solid var(--border)",
          borderRadius:"16px", padding:"28px",
          boxShadow:"0 4px 24px rgba(0,0,0,0.08)"
        }}>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <form onSubmit={handleStep1}>
              <h2 style={{
                fontFamily:"var(--font-playfair)", fontWeight:700,
                fontSize:"1.15rem", color:"var(--text-1)", marginBottom:"20px"
              }}>
                🔐 Sign In
              </h2>

              <div style={{ marginBottom:"14px" }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required autoComplete="email"
                  placeholder="admin@example.com"
                  className="admin-input"
                />
              </div>

              <div style={{ marginBottom:"18px" }}>
                <label style={labelStyle}>Password</label>
                <input
                  type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required autoComplete="current-password"
                  placeholder="••••••••"
                  className="admin-input"
                />
              </div>

              {error && <div className="alert alert-error" style={{ marginBottom:"14px" }}>⚠ {error}</div>}

              <button type="submit" disabled={loading} className="btn-primary"
                style={{ width:"100%", justifyContent:"center", height:"42px" }}>
                {loading ? "Verifying…" : "Continue →"}
              </button>
            </form>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <form onSubmit={handleStep2}>
              <h2 style={{
                fontFamily:"var(--font-playfair)", fontWeight:700,
                fontSize:"1.15rem", color:"var(--text-1)", marginBottom:"6px"
              }}>
                🛡 Security Verification
              </h2>
              <p style={{ fontSize:"0.78rem", color:"var(--text-3)", marginBottom:"20px" }}>
                Answer your security questions to complete login.
              </p>

              <div style={{ marginBottom:"14px" }}>
                <label style={labelStyle}>Q1: What is your full name?</label>
                <input
                  type="text" value={ans1}
                  onChange={(e) => setAns1(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="admin-input"
                  autoComplete="off"
                />
              </div>

              <div style={{ marginBottom:"18px" }}>
                <label style={labelStyle}>Q2: What is your mobile number?</label>
                <input
                  type="text" value={ans2}
                  onChange={(e) => setAns2(e.target.value)}
                  required
                  placeholder="Enter your mobile number"
                  className="admin-input"
                  autoComplete="off"
                  inputMode="numeric"
                />
              </div>

              {error && <div className="alert alert-error" style={{ marginBottom:"14px" }}>⚠ {error}</div>}

              <div style={{ display:"flex", gap:"10px" }}>
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(""); setAns1(""); setAns2(""); }}
                  className="btn-outline"
                  style={{ flex:1, justifyContent:"center", height:"42px" }}
                >
                  ← Back
                </button>
                <button type="submit" disabled={loading} className="btn-primary"
                  style={{ flex:2, justifyContent:"center", height:"42px" }}>
                  {loading ? "Verifying…" : "Access Admin →"}
                </button>
              </div>
            </form>
          )}
        </div>

        <p style={{ textAlign:"center", marginTop:"20px", fontSize:"0.75rem", color:"var(--text-3)" }}>
          <a href="/" style={{ color:"var(--brand-red)" }}>← Return to website</a>
        </p>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display:"block", fontSize:"0.7rem", fontWeight:700,
  textTransform:"uppercase", letterSpacing:"0.07em",
  color:"var(--text-3)", marginBottom:"6px"
};

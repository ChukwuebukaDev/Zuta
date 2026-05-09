"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/cars");
    }
  }, [status, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  

  if (form.password !== form.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone, // Ensure your backend expects this!
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      // Handle cases where the backend sends an error message
      throw new Error(data.error || "Signup failed");
    }

    toast.success("Account created! Please login.");
    
    // 2. Prepare for Login
    setMode("login");
   
    setForm({
      name: "",
      email: form.email, 
      phone: "",
      password: "",
      confirmPassword: "",
    });
    
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false, 
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    if (res?.ok) {
      toast.success("Welcome back!");
      router.push("/cars");
      router.refresh(); 
    }
  } catch (err) {
    setError("An unexpected error occurred");
    setLoading(false);
  }
};

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .auth-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #0a0a0a;
        }

        @media (max-width: 768px) {
          .auth-root { grid-template-columns: 1fr; }
          .auth-left { display: none !important; }
        }

        /* ── LEFT PANEL ── */
        .auth-left {
          position: relative;
          overflow: hidden;
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
        }

        .auth-left-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 50%, rgba(212,175,55,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 80%, rgba(212,175,55,0.08) 0%, transparent 50%);
        }

        .auth-left-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(212,175,55,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 70% 70% at 30% 50%, black 40%, transparent 100%);
        }

        .auth-left-content {
          position: relative;
          z-index: 1;
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .auth-logo-mark {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #d4af37, #f0d060);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Serif Display', serif;
          font-size: 20px;
          color: #0a0a0a;
          font-weight: 400;
        }

        .auth-logo-name {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .auth-left-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(42px, 4vw, 56px);
          line-height: 1.1;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .auth-left-headline em {
          font-style: italic;
          color: #d4af37;
        }

        .auth-left-sub {
          margin-top: 20px;
          font-size: 15px;
          color: rgba(255,255,255,0.45);
          line-height: 1.65;
          max-width: 320px;
          font-weight: 300;
        }

        .auth-left-stats {
          display: flex;
          gap: 32px;
        }

        .auth-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .auth-stat-value {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          color: #d4af37;
          line-height: 1;
        }

        .auth-stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* ── RIGHT PANEL ── */
        .auth-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          background: #f5f4f0;
          position: relative;
          overflow: hidden;
        }

        .auth-right::before {
          content: '';
          position: absolute;
          top: -40%;
          right: -20%;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 1;
        }

        .auth-mobile-logo {
          display: none;
          justify-content: center;
          margin-bottom: 32px;
        }

        @media (max-width: 768px) {
          .auth-mobile-logo { display: flex; }
        }

        .auth-heading {
          margin-bottom: 32px;
        }

        .auth-heading h1 {
          font-family: 'DM Serif Display', serif;
          font-size: 36px;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin: 0 0 8px;
        }

        .auth-heading p {
          font-size: 14px;
          color: #888;
          font-weight: 300;
          margin: 0;
        }

        /* ── FORM ── */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .auth-field {
          position: relative;
        }

        .auth-field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #aaa;
          width: 16px;
          height: 16px;
          pointer-events: none;
          flex-shrink: 0;
        }

        .auth-input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          background: #fff;
          border: 1.5px solid #e8e5de;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #0a0a0a;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          -webkit-appearance: none;
        }

        .auth-input::placeholder { color: #bbb; }

        .auth-input:focus {
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.12);
        }

        .auth-input-pr {
          padding-right: 44px;
        }

        .auth-eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #bbb;
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }

        .auth-eye-btn:hover { color: #666; }

        /* ── ERROR ── */
        .auth-error {
          background: #fff5f5;
          border: 1.5px solid #ffd5d5;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          color: #c0392b;
          font-weight: 500;
        }

        /* ── FORGOT ── */
        .auth-forgot {
          display: flex;
          justify-content: flex-end;
          margin-top: -4px;
        }

        .auth-forgot button {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          color: #999;
          padding: 0;
          transition: color 0.15s;
        }

        .auth-forgot button:hover { color: #0a0a0a; }

        /* ── SUBMIT ── */
        .auth-submit {
          margin-top: 6px;
          width: 100%;
          background: #0a0a0a;
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 14px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
          letter-spacing: -0.01em;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .auth-submit:hover:not(:disabled) {
          background: #1a1a1a;
          box-shadow: 0 6px 24px rgba(0,0,0,0.22);
        }

        .auth-submit:active:not(:disabled) {
          transform: scale(0.985);
        }

        .auth-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-submit-arrow {
          transition: transform 0.2s;
        }

        .auth-submit:hover:not(:disabled) .auth-submit-arrow {
          transform: translateX(3px);
        }

        /* ── DIVIDER ── */
        .auth-divider {
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1.5px solid #e8e5de;
          text-align: center;
        }

        .auth-divider p {
          font-size: 13.5px;
          color: #999;
          margin: 0;
        }

        .auth-switch-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          color: #0a0a0a;
          padding: 0;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.15s;
        }

        .auth-switch-btn:hover { color: #d4af37; }

        /* ── LABEL TAGS ── */
        .auth-field-label {
          display: block;
          font-size: 11.5px;
          font-weight: 500;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 6px;
        }

        /* ── SLIDE ANIMATION ── */
        .slide-in {
          animation: slideIn 0.25s ease forwards;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fade-up {
          opacity: 0;
          animation: fadeUp 0.5s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.12s; }
        .fade-up-3 { animation-delay: 0.2s; }
      `}</style>

      <div className="auth-root">
        {/* LEFT DECORATIVE PANEL */}
        <div className="auth-left">
          <div className="auth-left-bg" />
          <div className="auth-left-grid" />

          <div className="auth-left-content">
            <div className="auth-logo">
              <div className="auth-logo-mark">Z</div>
              <span className="auth-logo-name">Zuta</span>
            </div>
          </div>

          <div className="auth-left-content" style={{ maxWidth: 380 }}>
            <div className="auth-left-headline">
              Find your <em>perfect</em><br />drive.
            </div>
            <p className="auth-left-sub">
              Browse thousands of verified listings from trusted sellers. Premium cars, transparent pricing, zero hassle.
            </p>
          </div>

          <div className="auth-left-content">
            <div className="auth-left-stats">
              <div className="auth-stat">
                <span className="auth-stat-value">12k+</span>
                <span className="auth-stat-label">Listings</span>
              </div>
              <div className="auth-stat">
                <span className="auth-stat-value">98%</span>
                <span className="auth-stat-label">Verified</span>
              </div>
              <div className="auth-stat">
                <span className="auth-stat-value">4.9★</span>
                <span className="auth-stat-label">Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="auth-right">
          <div className="auth-card">
            {/* Mobile logo */}
            <div className="auth-mobile-logo">
              <div className="auth-logo-mark" style={{ width: 48, height: 48, fontSize: 24, background: '#0a0a0a', color: '#d4af37' }}>C</div>
            </div>

            <div className="auth-heading fade-up fade-up-1">
              <h1>{mode === "login" ? "Welcome back." : "Join us."}</h1>
              <p>{mode === "login" ? "Sign in to access your account" : "Create your account to start browsing"}</p>
            </div>

            {error && (
              <div className="auth-error slide-in" style={{ marginBottom: 16 }}>
                {error}
              </div>
            )}

            <form
              onSubmit={mode === "login" ? handleLogin : handleSignup}
              className="auth-form fade-up fade-up-2"
            >
              {mode === "signup" && (
                <div className="auth-field slide-in">
                  <label className="auth-field-label">Full name</label>
                  <div style={{ position: "relative" }}>
                    <User className="auth-field-icon" />
                    <input
                      name="name"
                      type="text"
                      placeholder="Jane Smith"
                      required
                      className="auth-input"
                      onChange={handleChange}
                      value={form.name}
                    />
                  </div>
                </div>
              )}

              <div className="auth-field">
                <label className="auth-field-label">Email address</label>
                <div style={{ position: "relative" }}>
                  <Mail className="auth-field-icon" />
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="auth-input"
                    onChange={handleChange}
                    value={form.email}
                  />
                </div>
              </div>

              {mode === "signup" && (
                <div className="auth-field slide-in">
                  <label className="auth-field-label">Phone (optional)</label>
                  <div style={{ position: "relative" }}>
                    <Phone className="auth-field-icon" />
                    <input
                      name="phone"
                      type="tel"
                      placeholder="+1 555 000 0000"
                      className="auth-input"
                      onChange={handleChange}
                      value={form.phone}
                    />
                  </div>
                </div>
              )}

              <div className="auth-field">
                <label className="auth-field-label">Password</label>
                <div style={{ position: "relative" }}>
                  <Lock className="auth-field-icon" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="auth-input auth-input-pr"
                    onChange={handleChange}
                    value={form.password}
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword
                      ? <EyeOff style={{ width: 16, height: 16 }} />
                      : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <div className="auth-field slide-in">
                  <label className="auth-field-label">Confirm password</label>
                  <div style={{ position: "relative" }}>
                    <Lock className="auth-field-icon" />
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="auth-input"
                      onChange={handleChange}
                      value={form.confirmPassword}
                    />
                  </div>
                </div>
              )}

              {mode === "login" && (
                <div className="auth-forgot">
                  <button type="button">Forgot password?</button>
                </div>
              )}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading
                  ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} />
                  : <>
                      {mode === "login" ? "Sign in" : "Create account"}
                      <ArrowRight className="auth-submit-arrow" style={{ width: 16, height: 16 }} />
                    </>
                }
              </button>
            </form>

            <div className="auth-divider fade-up fade-up-3">
              <p>
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button
                  className="auth-switch-btn"
                  onClick={() => {
                    setMode(mode === "login" ? "signup" : "login");
                    setError("");
                  }}
                >
                  {mode === "login" ? "Sign up" : "Log in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= SIGNUP ================= */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Signup failed");

      // auto-switch to login after signup
      toast.success("Account created successfully");
setMode("login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGIN ================= */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email: loginForm.email,
      password: loginForm.password,
      redirect: false,
    });
if (res?.error) {
  setError(res.error);
  return;
}

toast.success("Login successful");
window.location.href = "/";
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">

        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-1">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {mode === "login"
            ? "Login to continue browsing cars"
            : "Join to buy and sell cars easily"}
        </p>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {/* ================= LOGIN ================= */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
            />

            <button
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {/* ================= SIGNUP ================= */}
        {mode === "signup" && (
          <form onSubmit={handleSignup} className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg"
              onChange={(e) =>
                setSignupForm({ ...signupForm, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg"
              onChange={(e) =>
                setSignupForm({ ...signupForm, email: e.target.value })
              }
            />

            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-3 border rounded-lg"
              onChange={(e) =>
                setSignupForm({ ...signupForm, phone: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg"
              onChange={(e) =>
                setSignupForm({ ...signupForm, password: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 border rounded-lg"
              onChange={(e) =>
                setSignupForm({
                  ...signupForm,
                  confirmPassword: e.target.value,
                })
              }
            />

            <button
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        )}

        {/* ================= TOGGLE ================= */}
        <div className="mt-6 text-center text-sm">
          {mode === "login" ? (
            <p>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-black font-medium underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-black font-medium underline"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";

export default function User() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ Basic validation
    if (!email || !password) {
      return setError("Email and password are required");
    }

    if (mode === "signup") {
      if (!name) return setError("Name is required");
      if (password !== confirmPassword) {
        return setError("Passwords do not match");
      }
    }

    try {
      setLoading(true);

      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/signup";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response:", text);
        throw new Error("Server error");
      }

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      console.log("SUCCESS:", data);

      // 🔥 TODO: store token / redirect later
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-md bg-[#161616] rounded-2xl shadow-xl border border-gray-800 p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            {mode === "login"
              ? "Login to continue your journey"
              : "Join Zuta and start listing cars"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-red-400 text-sm text-center">{error}</div>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white focus:outline-none focus:border-white/30"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white focus:outline-none focus:border-white/30"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white focus:outline-none focus:border-white/30"
          />

          {mode === "signup" && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white focus:outline-none focus:border-white/30"
            />
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : mode === "login"
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        {/* Switch Mode */}
        <div className="mt-6 text-center text-sm text-gray-400">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-white hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-white hover:underline"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

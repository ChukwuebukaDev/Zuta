"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { login, signup, loginWithGoogle, resetPasswordRequest } from "@/app/(auth)/action";
import { Mail, Lock, User, Phone, ArrowRight, Loader2, MailCheck, ArrowLeft, Eye, EyeOff, KeyRound } from "lucide-react";

interface AuthCardProps {
  initialMode: "login" | "signup";
  backendError?: string;
}

export function AuthCard({ initialMode, backendError }: AuthCardProps) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";
  const router = useRouter();

  // Controlled Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    const formData = new FormData();
    formData.append("email", email);

    if (mode === "forgot") {
      startTransition(async () => {
        const result = await resetPasswordRequest(formData);
        if (result.error) {
          setLocalError(result.error);
        } else {
          setResetEmailSent(true);
        }
      });
      return;
    }

    formData.append("password", password);
    if (redirectUrl) formData.append("redirect", redirectUrl);
    if (mode === "signup") {
      formData.append("name", name);
      formData.append("phone", phone);
    }

    startTransition(async () => {
      try {
        let result;
        if (mode === "login") {
          result = await login(formData);
        } else {
          result = await signup(formData);
        }

        if (result?.error) {
          setLocalError(result.error);
          return;
        }

        if ("requiresConfirmation" in result && result.requiresConfirmation) {
          setConfirmationSent(true);
          return;
        }

        if (result?.success && result.redirectTo) {
          router.push(result.redirectTo);
          router.refresh();
        }
      } catch (err) {
        setLocalError("An unexpected connection error occurred.");
      }
    });
  };

  const activeError = localError || (backendError ? decodeURIComponent(backendError) : null);

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="w-full max-w-md bg-zinc-950 border border-zinc-900 pt-12 pb-8 px-8 rounded-2xl relative z-10 shadow-2xl shadow-black"
    >
      <AnimatePresence mode="wait">
        
        {/* RESET EMAIL SENT STATE */}
        {resetEmailSent ? (
          <motion.div
            key="reset-sent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-6 py-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <KeyRound size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black uppercase tracking-wider text-white">Reset Link Sent</h2>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
                We sent password recovery instructions to <strong className="text-white">{email}</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setResetEmailSent(false);
                setMode("login");
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Sign In</span>
            </button>
          </motion.div>
        ) : confirmationSent ? (
          /* EMAIL CONFIRMATION STATE */
          <motion.div
            key="confirmation-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-6 py-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <MailCheck size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black uppercase tracking-wider text-white">Check Your Inbox</h2>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
                We sent a confirmation link to <strong className="text-white">{email}</strong>. Please click the link to activate your account.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setConfirmationSent(false);
                setMode("login");
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Return to Sign In</span>
            </button>
          </motion.div>
        ) : (
          /* FORM BODY */
          <motion.div key="auth-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            
            {/* Header */}
            <motion.div layout="position" className="space-y-2 text-center mb-8">
              <motion.h1 layout="position" className="text-2xl font-black tracking-wider text-white uppercase font-sans">
                {mode === "login"
                  ? "Sign In to Zuta"
                  : mode === "signup"
                  ? "Create Profile"
                  : "Reset Password"}
              </motion.h1>
              <p className="text-xs text-zinc-500 font-medium">
                {mode === "login"
                  ? "Access Nigeria's premium luxury vehicle portal"
                  : mode === "signup"
                  ? "Join our exclusive automotive marketplace network"
                  : "Enter your email to receive recovery instructions"}
              </p>
            </motion.div>

            {/* Error Message */}
            {activeError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 mb-6 bg-red-500/5 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium"
              >
                {activeError}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {mode === "signup" && (
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -15 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -15 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="space-y-1.5 overflow-hidden"
                    >
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                        <input
                          name="name"
                          type="text"
                          required={mode === "signup"}
                          placeholder="Newton Chukwuebuka Aniugo"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-11 pr-4 py-4 bg-zinc-900/40 border border-zinc-800/80 focus:border-zinc-700 text-white placeholder:text-zinc-600 rounded-xl outline-none text-sm font-medium transition"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -15 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -15 }}
                      transition={{ duration: 0.2, ease: "easeInOut", delay: 0.05 }}
                      className="space-y-1.5 overflow-hidden"
                    >
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                        <input
                          name="phone"
                          type="tel"
                          required={mode === "signup"}
                          placeholder="+234..."
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-11 pr-4 py-4 bg-zinc-900/40 border border-zinc-800/80 focus:border-zinc-700 text-white placeholder:text-zinc-600 rounded-xl outline-none text-sm font-medium transition"
                        />
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-zinc-900/40 border border-zinc-800/80 focus:border-zinc-700 text-white placeholder:text-zinc-600 rounded-xl outline-none text-sm font-medium transition"
                  />
                </div>
              </div>

              {/* Password Input with Visibility Toggle & Forgot Password Link */}
              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Password
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => {
                          setLocalError(null);
                          setMode("forgot");
                        }}
                        className="text-[10px] font-semibold text-blue-500 hover:text-blue-400 transition cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-4 bg-zinc-900/40 border border-zinc-800/80 focus:border-zinc-700 text-white placeholder:text-zinc-600 rounded-xl outline-none text-sm font-medium transition"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                layout="position"
                type="submit"
                disabled={isPending}
                className="w-full h-14 mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-colors duration-200 shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 group cursor-pointer disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === "login"
                        ? "Authorize Session"
                        : mode === "signup"
                        ? "Complete Registration"
                        : "Send Reset Link"}
                    </span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Google Login (Only for Login / Signup) */}
            {mode !== "forgot" && (
              <>
                <motion.div layout="position" className="relative flex items-center py-5">
                  <div className="flex-grow border-t border-zinc-900"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600">or</span>
                  <div className="flex-grow border-t border-zinc-900"></div>
                </motion.div>

                <motion.button
                  layout="position"
                  type="button"
                  onClick={() => loginWithGoogle(redirectUrl)}
                  className="w-full h-14 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors duration-150 flex items-center justify-center gap-3 group cursor-pointer"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Continue with Google</span>
                </motion.button>
              </>
            )}

            {/* Switch Mode Footer */}
            <motion.div layout="position" className="mt-8 pt-6 border-t border-zinc-900 text-center">
              <p className="text-xs text-zinc-500 font-medium">
                {mode === "forgot" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setLocalError(null);
                      setMode("login");
                    }}
                    className="text-blue-500 hover:text-blue-400 font-semibold transition inline-flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft size={12} /> Back to Sign In
                  </button>
                ) : (
                  <>
                    {mode === "login" ? "New to the platform?" : "Already registered?"}{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setLocalError(null);
                        setMode(mode === "login" ? "signup" : "login");
                      }}
                      className="text-blue-500 hover:text-blue-400 font-semibold transition underline underline-offset-4 decoration-blue-500/20 cursor-pointer"
                    >
                      {mode === "login" ? "Create an account" : "Sign in here"}
                    </button>
                  </>
                )}
              </p>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
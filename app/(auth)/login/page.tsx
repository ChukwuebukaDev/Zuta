import { AuthCard } from "./AuthCard";

interface AuthPageProps {
  searchParams: Promise<{ mode?: string; error?: string }>;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const { mode, error } = await searchParams;
  const initialMode = mode === "signup" ? "signup" : "login";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Background Cinematic Lens Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[550px] bg-gradient-to-tr from-blue-900/10 via-zinc-900/5 to-transparent blur-3xl pointer-events-none rounded-full animate-pulse" />

      {/* Client-Side Animated Component Wrapper */}
      <AuthCard initialMode={initialMode} backendError={error} />
    </div>
  );
}
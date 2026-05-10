export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-600/10 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-xl z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">Partner with Zuta</h1>
          <p className="text-slate-500 mt-2">Complete your verification to open your showroom.</p>
        </div>
        {children}
      </div>
    </div>
  )
}
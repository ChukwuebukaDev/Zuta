import { Clock, ShieldCheck, Search } from "lucide-react"

export function PendingReview() {
  return (
    <div className="text-center space-y-6 py-10 bg-slate-900/40 rounded-3xl border border-slate-800/50 backdrop-blur-xl">
      <div className="flex justify-center">
        <div className="relative">
          <Clock className="text-blue-500 animate-pulse" size={64} />
          <Search className="absolute -bottom-2 -right-2 text-slate-400 bg-[#050505] rounded-full p-1" size={28} />
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-white">Application Under Review</h2>
        <p className="text-slate-400 mt-2 max-w-sm mx-auto">
          Our team is verifying your documents against your legal business name. This usually takes 24-48 hours.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 pt-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck size={14} className="text-blue-500" />
          <span>Your data is encrypted and stored securely.</span>
        </div>
      </div>
    </div>
  )
}
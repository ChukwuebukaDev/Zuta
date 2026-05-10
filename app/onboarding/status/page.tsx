import { Clock, ShieldCheck } from "lucide-react";

export default function OnboardingStatus() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center shadow-2xl">
        <div className="relative w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="text-blue-400 animate-pulse" size={40} />
          <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Application Received</h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Our team is currently reviewing your documents. This usually takes 24-48 hours. 
          We'll upgrade your account to <span className="text-blue-400 font-bold">Premium Dealer</span> once verified.
        </p>

        <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 flex items-center gap-3 text-left">
          <ShieldCheck className="text-emerald-500" size={20} />
          <span className="text-xs text-slate-300">Your documents are encrypted and stored securely.</span>
        </div>
      </div>
    </div>
  );
}
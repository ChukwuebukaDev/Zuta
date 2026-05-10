"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UploadButton } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { CheckCircle2, Loader2, FileText, CreditCard } from "lucide-react"

interface OnboardingFormProps {
  userId: string
  userEmail: string
}

export default function OnboardingForm({ userId, userEmail }: OnboardingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [legalName, setLegalName] = useState("")
  const [docs, setDocs] = useState<{ type: string; url: string }[]>([])

  // Logic: Helper to check if a specific document is uploaded
  const hasId = docs.some((d) => d.type === "GOVT_ID")
  const hasCard = docs.some((d) => d.type === "BUSINESS_CARD")
  const isComplete = legalName.length > 3 && hasId && hasCard

  async function onSubmit() {
    if (!isComplete) return
    setLoading(true)
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, legalName, documents: docs }),
      })

      if (response.ok) {
        toast.success("Application submitted successfully!")
        router.push("/onboarding/status")
        router.refresh()
      } else {
        throw new Error("Failed to submit")
      }
    } catch (error) {
      toast.error("Database submission failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Common Button UI Configuration
  const buttonConfig = (typeLabel: string) => ({
    content: {
      button({ isUploading, ready }: { isUploading: boolean; ready: boolean }) {
        if (isUploading) return <div className="flex gap-2"><Loader2 className="animate-spin" size={16}/> Uploading...</div>
        if (ready) return `Upload ${typeLabel}`
        return "Initializing..."
      },
      allowedContent: "Image (Max 4MB)"
    },
    appearance: {
      button: "bg-blue-600 hover:bg-blue-700 text-sm font-bold px-6 h-10 rounded-lg transition-colors",
      allowedContent: "text-[10px] text-slate-500 uppercase mt-2 font-semibold tracking-tighter"
    }
  })

  return (
    <div className="space-y-8">
      {/* Name Input Section */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Legal Business / Individual Name
        </label>
        <Input 
          placeholder="e.g. Zuta Luxury Motors" 
          value={legalName}
          onChange={(e) => setLegalName(e.target.value)}
          className="bg-slate-950/50 border-slate-800 text-white h-14 text-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ID Upload Card */}
        <div className={`relative p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-4 ${
          hasId ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
        }`}>
          <div className={`p-3 rounded-full ${hasId ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-400'}`}>
            <FileText size={24} />
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Government ID</p>
            <p className="text-[10px] text-slate-600 mt-1 italic">Passport or Driver's License</p>
          </div>
          
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (!res?.[0]) return
              setDocs((prev) => [...prev.filter(d => d.type !== "GOVT_ID"), { type: "GOVT_ID", url: res[0].url }])
              toast.success("Identity Document Verified")
            }}
           onUploadError={(error) => {
  toast.error(`Upload Failed: ${error.message}`);
}}
            {...buttonConfig("ID")}
          />

          {hasId && (
            <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold animate-in fade-in zoom-in">
              <CheckCircle2 size={18} /> Ready to Process
            </div>
          )}
        </div>

        {/* Business Card Upload Card */}
        <div className={`relative p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-4 ${
          hasCard ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
        }`}>
          <div className={`p-3 rounded-full ${hasCard ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-400'}`}>
            <CreditCard size={24} />
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Business Card</p>
            <p className="text-[10px] text-slate-600 mt-1 italic">Proof of Dealership</p>
          </div>

          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (!res?.[0]) return
              setDocs((prev) => [...prev.filter(d => d.type !== "BUSINESS_CARD"), { type: "BUSINESS_CARD", url: res[0].url }])
              toast.success("Business Card Synced")
            }}
            onUploadError={(error) => {
  toast.error(`Upload Failed: ${error.message}`);
}}
            {...buttonConfig("Card")}
          />

          {hasCard && (
            <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold animate-in fade-in zoom-in">
              <CheckCircle2 size={18} /> Ready to Process
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button 
        onClick={onSubmit} 
        disabled={!isComplete || loading} 
        className="group relative w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 h-16 text-white rounded-2xl shadow-xl shadow-blue-900/20 transition-all duration-300 disabled:opacity-20 font-black text-lg uppercase tracking-widest"
      >
        {loading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin" size={24} /> 
            <span>Encrypting Data...</span>
          </div>
        ) : (
          <span className="flex items-center gap-2">
            Submit Application
          </span>
        )}
      </Button>
      
      <p className="text-center text-[10px] text-slate-600 uppercase tracking-widest font-medium">
        Secure End-to-End Verification Powered by Zuta
      </p>
    </div>
  )
}
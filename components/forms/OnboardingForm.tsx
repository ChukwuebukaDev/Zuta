"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UploadButton } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CheckCircle2, FileUp } from "lucide-react"

interface OnboardingFormProps {
  userId: string
  userEmail: string
}

export default function OnboardingForm({ userId, userEmail }: OnboardingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [legalName, setLegalName] = useState("")
  const [docs, setDocs] = useState<{ type: string; url: string }[]>([])

  const isComplete = legalName.length > 3 && docs.length >= 2

  async function onSubmit() {
    setLoading(true)
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        body: JSON.stringify({ userId, legalName, documents: docs }),
      })

      if (response.ok) {
        toast.success("Application submitted!")
        router.push("/onboarding/status")
        router.refresh()
      }
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Legal Business/Individual Name</label>
        <Input 
          placeholder="e.g. John Doe or Zuta Luxury Motors" 
          value={legalName}
          onChange={(e) => setLegalName(e.target.value)}
          className="bg-slate-950 border-slate-800 text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ID Upload */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 flex flex-col items-center gap-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Government ID</p>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setDocs((prev) => [...prev, { type: "GOVT_ID", url: res[0].url }])
              toast.success("ID Uploaded")
            }}
          />
          {docs.find(d => d.type === "GOVT_ID") && <CheckCircle2 className="text-emerald-500" size={20} />}
        </div>

        {/* Business Card Upload */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 flex flex-col items-center gap-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Business Card</p>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setDocs((prev) => [...prev, { type: "BUSINESS_CARD", url: res[0].url }])
              toast.success("Card Uploaded")
            }}
          />
          {docs.find(d => d.type === "BUSINESS_CARD") && <CheckCircle2 className="text-emerald-500" size={20} />}
        </div>
      </div>

      <Button 
        onClick={onSubmit} 
        disabled={!isComplete || loading} 
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold transition-all disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </Button>
    </div>
  )
}
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  CheckCircle2,
  Loader2,
  FileText,
  CreditCard,
} from "lucide-react";

interface OnboardingFormProps {
  userId: string;
  userEmail: string;
}

type DocumentType = "GOVT_ID" | "BUSINESS_CARD";

interface UploadedDocument {
  type: DocumentType;
  url: string;
}

export default function OnboardingForm({ userId }: OnboardingFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [uploadingType, setUploadingType] = useState<DocumentType | null>(null);
  const [legalName, setLegalName] = useState("");
  const [docs, setDocs] = useState<UploadedDocument[]>([]);

  /* -------------------------------- */
  /* Derived State                    */
  /* -------------------------------- */

  const hasId = useMemo(() => docs.some((d) => d.type === "GOVT_ID"), [docs]);
  const hasCard = useMemo(() => docs.some((d) => d.type === "BUSINESS_CARD"), [docs]);

  // Validation: Name must be 3+ chars, and both docs must be uploaded
  const isValidName = legalName.trim().length >= 3;
  const isComplete = isValidName && hasId && hasCard;

  async function onSubmit() {
    if (!isComplete || loading) return;

    setLoading(true);
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          legalName: legalName.trim(),
          documents: docs,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Submission failed");
      }

      toast.success("Application submitted successfully!");
      router.push("/onboarding/status");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Database connection error");
    } finally {
      setLoading(false);
    }
  }

  /* -------------------------------- */
  /* Upload Configuration             */
  /* -------------------------------- */

  const getUploadConfig = (type: DocumentType) => ({
    endpoint: "imageUploader" as const,

    onUploadBegin: () => {
      setUploadingType(type);
    },

    onClientUploadComplete: (res: any) => {
      const url = res?.[0]?.url;
      if (!url) return;

      setDocs((prev) => {
        const filtered = prev.filter((d) => d.type !== type);
        return [...filtered, { type, url }];
      });

      setUploadingType(null);
      toast.success(`${type === "GOVT_ID" ? "Identity" : "Business"} file verified`);
    },

    onUploadError: (error: Error) => {
      setUploadingType(null);
      toast.error(`Upload Error: ${error.message}`);
    },

    content: {
      button() {
        if (uploadingType === type) return <Loader2 className="animate-spin" size={16} />;
        const exists = type === "GOVT_ID" ? hasId : hasCard;
        return exists ? "Change File" : "Choose File";
      },
      allowedContent: "Images only • Max 4MB",
    },

    appearance: {
      button: "bg-blue-600 hover:bg-blue-700 text-xs font-bold px-4 h-9 rounded-lg transition-all",
      allowedContent: "text-[10px] text-slate-500 uppercase mt-2 font-medium",
    },
  });

  return (
    <div className="space-y-8">
      {/* Business Name Input */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Legal Business / Individual Name
        </label>
        <Input
          placeholder="e.g. Zuta Luxury Motors"
          value={legalName}
          onChange={(e) => setLegalName(e.target.value)}
          className="bg-slate-950/50 border-slate-800 text-white h-14 text-lg focus:ring-blue-600"
        />
      </div>

      {/* Upload Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Government ID Card */}
        <div className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-4 ${
          hasId ? "border-emerald-500/50 bg-emerald-500/5" : "border-slate-800 bg-slate-900/40"
        }`}>
          <div className={`p-3 rounded-full ${hasId ? "bg-emerald-500/20 text-emerald-500" : "bg-slate-800 text-slate-400"}`}>
            <FileText size={24} />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Government ID</p>
          <UploadButton {...getUploadConfig("GOVT_ID")} />
          {hasId && (
            <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold animate-in zoom-in">
              <CheckCircle2 size={18} /> Ready
            </div>
          )}
        </div>

        {/* Business Card Upload */}
        <div className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-4 ${
          hasCard ? "border-emerald-500/50 bg-emerald-500/5" : "border-slate-800 bg-slate-900/40"
        }`}>
          <div className={`p-3 rounded-full ${hasCard ? "bg-emerald-500/20 text-emerald-500" : "bg-slate-800 text-slate-400"}`}>
            <CreditCard size={24} />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Business Card</p>
          <UploadButton {...getUploadConfig("BUSINESS_CARD")} />
          {hasCard && (
            <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold animate-in zoom-in">
              <CheckCircle2 size={18} /> Ready
            </div>
          )}
        </div>
      </div>

      {/* Main Action Button */}
      <Button
        onClick={onSubmit}
        disabled={!isComplete || loading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 h-16 text-white rounded-2xl shadow-xl transition-all disabled:opacity-20 font-black text-lg uppercase tracking-widest"
      >
        {loading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin" size={24} />
            <span>Processing Application...</span>
          </div>
        ) : (
          "Submit Application"
        )}
      </Button>

      <p className="text-center text-[10px] text-slate-600 uppercase tracking-widest">
        Secure Identity Verification • Powered by Zuta
      </p>
    </div>
  );
}
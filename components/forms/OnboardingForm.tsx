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
  Building2,
  MapPin,
  Tag,
  Phone,
  Mail,
} from "lucide-react";

// Explicit Uploadthing Response Typing
interface UploadthingFileResponse {
  name: string;
  size: number;
  key: string;
  url: string;
  serverData: unknown;
}

interface OnboardingFormProps {
  userId: string;
  userEmail: string;
  avatarUrl: string;
  phone?: string; // 💡 Captured from our unified signup form step
}

type DocumentType = "GOVT_ID" | "BUSINESS_CARD";

interface UploadedDocument {
  type: DocumentType;
  url: string;
}

export default function OnboardingForm({ userId, phone: initialPhone }: OnboardingFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [uploadingType, setUploadingType] = useState<DocumentType | null>(null);
  
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [cacNumber, setCacNumber] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [tagline, setTagline] = useState("");
  const [docs, setDocs] = useState<UploadedDocument[]>([]);
  const [phone, setPhone] = useState(initialPhone || ""); // 💡 Hydrated fallback assignment

  const hasId = useMemo(() => docs.some((d) => d.type === "GOVT_ID"), [docs]);
  const hasCard = useMemo(() => docs.some((d) => d.type === "BUSINESS_CARD"), [docs]);

  const isValidName = businessName.trim().length >= 3;
  const isValidCac = cacNumber.trim().length >= 6; 
  const isValidAddress = businessAddress.trim().length >= 10;
  const isValidEmail = businessEmail.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail.trim());
  const isValidPhone = phone.trim().length >= 8;
  
  const isComplete = isValidName && isValidCac && isValidAddress && isValidEmail && isValidPhone && hasId && hasCard;

  async function onSubmit() {
    if (!isComplete || loading) return;

    setLoading(true);
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          businessName: businessName.trim(),
          businessEmail: businessEmail.trim() || undefined,
          phone: phone.trim(),
          cacNumber: cacNumber.trim(),
          businessAddress: businessAddress.trim(),
          tagline: tagline.trim() || undefined,
          documents: docs,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as { message?: string };
        throw new Error(errorData.message || "Submission failed");
      }

      toast.success("Dealership application submitted successfully!");
      
      router.push("/onboarding/status");
      router.refresh();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Database connection error";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Explicitly typed config generator to fix functional "any" callbacks
  const getUploadConfig = (type: DocumentType) => ({
    endpoint: "imageUploader" as const,
    onUploadBegin: () => {
      setUploadingType(type);
    },
    onClientUploadComplete: (res: UploadthingFileResponse[] | undefined) => {
      const url = res?.[0]?.url;
      if (!url) return;

      setDocs((prev) => {
        const filtered = prev.filter((d) => d.type !== type);
        return [...filtered, { type, url }];
      });

      setUploadingType(null);
      toast.success(`${type === "GOVT_ID" ? "Identity Proof" : "Business Document"} file verified`);
    },
    onUploadError: (error: Error) => {
      setUploadingType(null);
      toast.error(`Upload Error: ${error.message}`);
    },
    content: {
      button() {
        if (uploadingType === type) return <Loader2 className="animate-spin" size={16} />;
        return (type === "GOVT_ID" ? hasId : hasCard) ? "Change File" : "Choose File";
      },
      allowedContent: "Images only • Max 4MB",
    },
    appearance: {
      button: "bg-blue-600 hover:bg-blue-700 text-xs font-bold px-4 h-9 rounded-lg transition-all",
      allowedContent: "text-[10px] text-slate-500 uppercase mt-2 font-medium",
    },
  });

  return (
    <div className="space-y-6">
      {/* 1. Dealership Identity Fields Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Building2 size={14} /> Registered Dealership Name
          </label>
          <Input
            placeholder="e.g. Zuta Luxury Motors"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="bg-slate-950/50 border-slate-800 text-white h-12 text-sm focus:ring-blue-600 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <FileText size={14} /> RC / CAC Registration Number
          </label>
          <Input
            placeholder="e.g. RC-1234567"
            value={cacNumber}
            onChange={(e) => setCacNumber(e.target.value)}
            className="bg-slate-950/50 border-slate-800 text-white h-12 text-sm focus:ring-blue-600 rounded-xl"
          />
        </div>
      </div>

      {/* 2. Business Contact Phone Number */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Phone size={14} /> Business Contact Phone Number
        </label>
        <Input
          placeholder="e.g. +234 801 234 5678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-slate-950/50 border-slate-800 text-white h-12 text-sm focus:ring-blue-600 rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Mail size={14} /> Business Email Address
        </label>
        <Input
          placeholder="e.g. info@zuta.com"
          value={businessEmail}
          onChange={(e) => setBusinessEmail(e.target.value)}
          className="bg-slate-950/50 border-slate-800 text-white h-12 text-sm focus:ring-blue-600 rounded-xl"
        />
      </div>

      {/* 3. Dealership Slogan / Tagline */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Tag size={14} /> Business Slogan / Tagline (Optional)
        </label>
        <Input
          placeholder="e.g. Driven by Excellence, Defined by Luxury"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className="bg-slate-950/50 border-slate-800 text-white h-12 text-sm focus:ring-blue-600 rounded-xl"
        />
      </div>

      {/* 4. Physical Showroom Address */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <MapPin size={14} /> Showroom / Office Physical Address
        </label>
        <textarea
          placeholder="e.g. Plot 14, Kingsway Road, Ikoyi, Lagos, Nigeria"
          value={businessAddress}
          onChange={(e) => setBusinessAddress(e.target.value)}
          className="w-full bg-slate-950/50 border border-slate-800 p-4 text-white min-h-[80px] text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 rounded-xl resize-none"
        />
      </div>

      {/* 5. Upload Cards Selection Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Government ID Card */}
        <div className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-4 ${
          hasId ? "border-emerald-500/30 bg-emerald-500/5" : "border-slate-800/80 bg-slate-950/40"
        }`}>
          <div className={`p-3 rounded-xl ${hasId ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-900 text-slate-500"}`}>
            <FileText size={20} />
          </div>
          <div className="text-center">
            <p className="text-xs font-black text-white uppercase tracking-wider">Representative ID</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Driver&apos;s License or Int&apos;l Passport</p>
          </div>
          <UploadButton {...getUploadConfig("GOVT_ID")} />
          {hasId && (
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-black uppercase tracking-wider animate-in zoom-in">
              <CheckCircle2 size={14} /> Ready
            </div>
          )}
        </div>

        {/* Corporate Proof / Utility */}
        <div className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-4 ${
          hasCard ? "border-emerald-500/30 bg-emerald-500/5" : "border-slate-800/80 bg-slate-950/40"
        }`}>
          <div className={`p-3 rounded-xl ${hasCard ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-900 text-slate-500"}`}>
            <CreditCard size={20} />
          </div>
          <div className="text-center">
            <p className="text-xs font-black text-white uppercase tracking-wider">Business Verification</p>
            <p className="text-[10px] text-slate-500 mt-0.5">CAC Certificate or Business Card</p>
          </div>
          <UploadButton {...getUploadConfig("BUSINESS_CARD")} />
          {hasCard && (
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-black uppercase tracking-wider animate-in zoom-in">
              <CheckCircle2 size={14} /> Ready
            </div>
          )}
        </div>
      </div>

      {/* Main Form Action Handler */}
      <Button
        onClick={onSubmit}
        disabled={!isComplete || loading}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white h-14 rounded-xl shadow-xl transition-all disabled:opacity-50 font-black text-xs uppercase tracking-widest mt-4"
      >
        {loading ? (
          <div className="flex items-center gap-2 justify-center">
            <Loader2 className="animate-spin" size={18} />
            <span>Processing Application Credentials...</span>
          </div>
        ) : (
          "Submit Dealership Application"
        )}
      </Button>

      <p className="text-center text-[9px] text-slate-600 uppercase tracking-widest">
        Secure Corporate Identity Check • Powered by Zuta
      </p>
    </div>
  );
}
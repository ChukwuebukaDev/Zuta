import Image from "next/image"
import { notFound, redirect } from "next/navigation"
import {prisma as db } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card/Card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { approveDealer, rejectDealer } from "../action";

export default async function VerificationDetail({
  params,
}: {
  params: { id: string }
}) {
  // 1. Fetch Request Data
  const request = await db.verificationRequest.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { email: true, name: true } },
      documents: true,
    },
  })

  if (!request) {
    notFound();
  }

  // 2. Handle Server Action Wrappers
  async function handleApprove() {
    "use server"
    await approveDealer(request!.id)
    redirect("/admin/dashboard/verification")
  }

  async function handleReject(formData: FormData) {
    "use server"
    const reason = formData.get("reason") as string
    await rejectDealer(request!.id, reason)
    redirect("/admin/dashboard/verification")
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {request.legalName}
            </h1>
            <Badge
              variant={request.status === "SUBMITTED" ? "warning" : "success"}
              className="capitalize"
            >
              {request.status.toLowerCase()}
            </Badge>
          </div>
          <p className="text-slate-400 mt-1">
            Applicant: <span className="text-slate-200">{request.user.email}</span>
          </p>
        </div>

        <div className="flex gap-3">
          {/* Rejection Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                Reject Application
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle>Reject Application</DialogTitle>
                <DialogDescription>
                  Provide a reason for rejection. This will be shared with the dealer.
                </DialogDescription>
              </DialogHeader>
              <form action={handleReject} className="space-y-4 pt-4">
                <textarea
                  name="reason"
                  required
                  placeholder="e.g., The Government ID is expired or blurry..."
                  className="w-full min-h-[120px] rounded-md bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:ring-1 focus:ring-red-500 outline-none"
                />
                <DialogFooter>
                  <Button type="submit" variant="destructive">
                    Confirm Rejection
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Approval Form */}
          <form action={handleApprove}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Approve Dealer
            </Button>
          </form>
        </div>
      </div>

      <hr className="border-slate-800" />

      {/* Main Content: Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Summary & Audit */}
        <div className="space-y-6">
          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Vetting Checklist
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">1</div>
                <span>Verify Legal Name matches ID</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">2</div>
                <span>Check ID expiration date</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">3</div>
                <span>Confirm Business Card validity</span>
              </div>
            </div>
          </Card>

          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
            <p className="text-xs text-blue-400 leading-relaxed">
              <strong>Admin Note:</strong> Approving this user will instantly upgrade their role to DEALER and allow them to post car listings.
            </p>
          </div>
        </div>

        {/* Right Column: Document Gallery */}
        <div className="lg:col-span-2 space-y-8">
          {request.documents.map((doc) => (
            <div key={doc.id} className="group">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-slate-300">
                  {doc.type.replace("_", " ")}
                </h4>
                <a 
                  href={doc.url} 
                  target="_blank" 
                  className="text-xs text-blue-400 hover:underline"
                >
                  View Full Resolution
                </a>
              </div>
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
                <Image
                  src={doc.url}
                  alt={doc.type}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
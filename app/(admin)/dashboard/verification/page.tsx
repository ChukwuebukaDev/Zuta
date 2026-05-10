import { prisma as db } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table/Table";
import { Button } from "@/components/ui/controls/Button"
import Link from "next/link"

export default async function VerificationPage() {
  // Fetch all pending requests including the user's email
  const requests = await db.verificationRequest.findMany({
    where: { status: "SUBMITTED" },
    include: { 
      user: { select: { email: true } },
      documents: true 
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dealer Applications</h1>
        <p className="text-slate-400">Review and verify incoming dealer identities.</p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-950">
            <TableRow>
              <TableHead>Legal Business Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Docs</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id} className="border-slate-800 hover:bg-slate-800/30">
                <TableCell className="font-medium text-slate-200">{req.legalName}</TableCell>
                <TableCell className="text-slate-400">{req.user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                    {req.documents.length} Files
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500 text-xs">
                  {new Date(req.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-blue-400" asChild>
                    <Link href={`/admin/dashboard/verification/${req.id}`}>Review</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
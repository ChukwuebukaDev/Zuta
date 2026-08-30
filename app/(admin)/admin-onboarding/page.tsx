import { prisma } from "@/lib/prisma";
import { VerificationTable } from "@/components/ui/table/VerificationTable";

export default async function AdminOnboardingPage() {
  const users = await prisma.user.findMany({
    where: {
      verificationRequest: {status:"SUBMITTED"},
    },
    select:{verificationRequest:true},
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Onboarding Review</h1>
        <p className="text-muted-foreground">
          Review and verify dealer identity documents.
        </p>
      </div>

      <VerificationTable users={users} />
    </div>
  );
}
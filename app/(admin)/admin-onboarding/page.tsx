import { prisma } from "@/lib/prisma";
import { VerificationTable } from "@/components/ui/table/VerificationTable";

export default async function AdminOnboardingPage() {
  const verificationRequests =
    await prisma.verificationRequest.findMany({
      where: {
        status: "SUBMITTED",
      },

      select: {
        id: true,
        legalName: true,
        status: true,

        documents: {
          select: {
            type: true,
            url: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });


  const requests = verificationRequests.map(
    (request) => ({
      id: request.id,

      legalName: request.legalName,

      status: request.status,

      idUrl:
        request.documents.find(
          (document) =>
            document.type === "GOVT_ID"
        )?.url ?? "",

      cardUrl:
        request.documents.find(
          (document) =>
            document.type === "BUSINESS_CARD"
        )?.url ?? "",
    })
  );

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Onboarding Review
        </h1>

        <p className="text-muted-foreground">
          Review and verify dealer identity documents.
        </p>
      </div>

      <VerificationTable
        requests={requests}
      />
    </div>
  );
}

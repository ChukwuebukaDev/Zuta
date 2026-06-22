import { auth } from "@clerk/nextjs/server";
import { prisma as db } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Normalize metadata layer check to lowercase
  const metadataRole = (sessionClaims?.metadata as { role?: string } | undefined)?.role?.toLowerCase();
  
  const isSeller = metadataRole === "seller" || metadataRole === "dealer";

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { 
      role: true, 
      isVerified: true,
      onboardingComplete: true 
    }
  });

  if (user?.role === "BUYER" || metadataRole === "buyer") {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        {children}
      </div>
    );
  }

  // 🛡️ 3. If they are trying to act as a seller/dealer, enforce dealership onboarding verification checks
  if (isSeller) {
    if (!user?.isVerified) {
      if (user?.onboardingComplete) {
        redirect("/onboarding/status");
      } else {
        redirect("/onboarding");
      }
    }
  } else {
    // Fallback security door if role string remains completely corrupted/unrecognized
    redirect("/cars");
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {children}
    </div>
  );
}
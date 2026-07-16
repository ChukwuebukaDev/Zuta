import Hero from "@/components/ui/Home/Hero";
import { createClient } from "@/supabase/server";
import { prisma as db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();


  let dbUser = null;
  if (authUser) {
    dbUser = await db.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        privateListingLimit: true,
        dealerProfile: {
          select: {
            businessName: true,
            rating: true,
            totalSales: true,
          }
        }
      }
    });
    
  }
  return (
    <> 
      <Hero user={dbUser} />
    </>
  );
}
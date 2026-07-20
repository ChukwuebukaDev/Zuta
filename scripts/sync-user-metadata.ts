import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

async function syncUsers() {
  console.log("🚀 Starting user metadata sync...\n");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      role: true,
      onboardingComplete: true,
      privateListingLimit: true,
      isVerified: true,
    },
  });

  console.log(`Found ${users.length} users.\n`);

  let success = 0;
  let failed = 0;

  for (const user of users) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          role: user.role,
          onboardingComplete: user.onboardingComplete,
          privateListingLimit: user.privateListingLimit,
          isVerified: user.isVerified,
        },
      }
    );

    if (error) {
      failed++;

      console.error(
        `❌ Failed syncing ${user.id}:`,
        error.message
      );
    } else {
      success++;

      console.log(
        `✅ Synced ${user.id} (${user.role})`
      );
    }
  }

  console.log("\n=================================");
  console.log(`Finished!`);
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed : ${failed}`);
  console.log("=================================\n");
}

syncUsers()
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
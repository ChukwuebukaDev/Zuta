"use server";

import { prisma as db } from "@/lib/prisma";
import { TicketX } from "lucide-react";
import { revalidatePath } from "next/cache";

export async function approveDealer(requestId: string) {
  const approvedAt = new Date();

  await db.$transaction(async (tx) => {
    // 1. Get verification request

    const request = await tx.verificationRequest.findUnique({
      where: {
        id: requestId,
      },

      select: {
        id: true,
        userId: true,
        status: true,

        user: {
          select: {
            id: true,
            role: true,
            privateListingLimit: true,
          },
        },

        // We need the submitted dealership information
        // to create the DealerProfile.
        legalName: true,
        businessAddress: true,
        businessEmail:true,
        cacNumber: true,
        tagline:true,
        phone:true,

        documents: {
          select: {
            type: true,
            url: true,
          },
        },
      },
    });

    // 2. Validate request

    if (!request) {
      throw new Error("Verification request not found.");
    }

    if (request.status !== "SUBMITTED") {
      throw new Error(
        `This verification request has already been ${request.status.toLowerCase()}.`
      );
    }

    if (!request.user) {
      throw new Error("Applicant account not found.");
    }

    if (request.user.role === "DEALER") {
      throw new Error(
        "This account is already registered as a dealer."
      );
    }

    // ============================================================
    // 3. Find required documents


    const businessCard = request.documents.find(
      (document) => document.type === "BUSINESS_CARD"
    );

    if (!businessCard) {
      throw new Error(
        "Business card document is missing."
      );
    }


    // 4. Calculate listing allowance before modifying the user


    const privateListingLimit =
      request.user.privateListingLimit;


    // 5. Generate dealer slug


    const baseSlug = request.legalName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const dealerSlug = `${baseSlug}-${crypto
      .randomUUID()
      .replace(/-/g, "")
      .substring(0, 8)}`;


    // 6. Approve verification request


    await tx.verificationRequest.update({
      where: {
        id: request.id,
      },

      data: {
        status: "APPROVED",
        approvedAt,
      },
    });


    // 7. Create DealerProfile


    const dealerProfile = await tx.dealerProfile.create({
      data: {
        businessName: request.legalName,
        slug: dealerSlug,
        businessEmail:request.businessEmail,
        phone:request.phone,
        isVerified:true,
        status:'APPROVED',
        businessAddress: request.businessAddress,
        cacNumber: request.cacNumber,
        tagline:request.tagline,

        logo: businessCard.url,
        approvedAt,

        user: {
          connect: {
            id: request.userId,
          },
        },

      },
          select:{
          id:true,
          listingLimits:true,
        }
    });


    // 8. Promote user to DEALER
const totalListingLimit = privateListingLimit + dealerProfile.listingLimits;

    await tx.user.update({
      where: {
        id: request.userId,
      },

      data: {
        role: "DEALER",
       onboardingComplete: true,
        privateListingLimit: 0,
      },
    });

  await tx.dealerProfile.update({
    where:{id:dealerProfile.id},
    data:{
      listingLimits:totalListingLimit,

    }
  })

  });



  // 9. Refresh admin dashboard

  revalidatePath(
    "/admin/dashboard/verification"
  );
}


// REJECT DEALER

export async function rejectDealer(
  requestId: string,
  notes: string
) {
  const normalizedNotes = notes.trim();

  await db.$transaction(async (tx) => {

    // 1. Get request


    const request =
      await tx.verificationRequest.findUnique({
        where: {
          id: requestId,
        },

        select: {
          id: true,
          status: true,
        },
      });

    if (!request) {
      throw new Error(
        "Verification request not found."
      );
    }


    // 2. Prevent processing an already processed request


    if (request.status !== "SUBMITTED") {
      throw new Error(
        `This verification request has already been ${request.status.toLowerCase()}.`
      );
    }


    // 3. Reject request


    await tx.verificationRequest.update({
      where: {
        id: request.id,
      },

      data: {
        status: "REJECTED",
        adminNotes: normalizedNotes || null,
      },
    });
  });

  // 4. Refresh admin dashboard

  revalidatePath(
    "/admin/dashboard/verification"
  );
}

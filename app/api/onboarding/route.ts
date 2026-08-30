
// import { NextResponse } from "next/server";
// import { prisma as db } from "@/lib/prisma";
// import { createClient } from "@/supabase/server";
// import { supabaseAdmin } from "@/supabase/admin";

// interface IncomingDocument {
//   type: "GOVT_ID" | "BUSINESS_CARD" | "CAC_CERTIFICATE";
//   url: string;
// }

// interface OnboardingRequestBody {
//   businessName: string;
//   businessEmail: string;
//   phone: string;
//   cacNumber: string;
//   businessAddress: string;
//   tagline?: string;
//   documents: IncomingDocument[];
// }

// export async function POST(req: Request) {
//   try {
//   
//     // 1. Validate authenticated Supabase session
//   

//     const supabase = await createClient();
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       return NextResponse.json(
//         { message: "Unauthorized session." },
//         { status: 401 }
//       );
//     }

//   
//     // 2. Parse request body
//   

//     let body: OnboardingRequestBody;

//     try {
//       body = await req.json();
//     } catch {
//       return NextResponse.json(
//         { message: "Invalid request body." },
//         { status: 400 }
//       );
//     }

//     const {
//       businessName,
//       businessEmail,
//       phone,
//       cacNumber,
//       businessAddress,
//       tagline,
//       documents,
//     } = body;

//     // ============================================================
//     // 3. Validate required fields
//     // ============================================================

//     if (
//       !businessName?.trim() ||
//       !businessEmail?.trim() ||
//       !phone?.trim() ||
//       !cacNumber?.trim() ||
//       !businessAddress?.trim()
//     ) {
//       return NextResponse.json(
//         {
//           message: "Missing required dealership information.",
//         },
//         { status: 400 }
//       );
//     }

//     if (!Array.isArray(documents) || documents.length < 2) {
//       return NextResponse.json(
//         {
//           message: "At least two verification documents are required.",
//         },
//         { status: 400 }
//       );
//     }

//     // ============================================================
//     // 4. Validate verification documents
//     // ============================================================

//     const govtId = documents.find(
//       (doc) => doc.type === "GOVT_ID"
//     );

//     const businessCard = documents.find(
//       (doc) => doc.type === "BUSINESS_CARD"
//     );

//     if (!govtId?.url || !businessCard?.url) {
//       return NextResponse.json(
//         {
//           message:
//             "Government ID and business card are required for verification.",
//         },
//         { status: 400 }
//       );
//     }

//     // Validate every document
//     const invalidDocument = documents.some(
//       (doc) =>
//         !doc ||
//         !doc.type ||
//         !doc.url ||
//         typeof doc.url !== "string" ||
//         !doc.url.trim()
//     );

//     if (invalidDocument) {
//       return NextResponse.json(
//         {
//           message: "One or more verification documents are invalid.",
//         },
//         { status: 400 }
//       );
//     }

//     // ============================================================
//     // 5. Normalize input
//     // ============================================================

//     const normalizedBusinessName = businessName.trim();
//     const normalizedBusinessEmail = businessEmail
//       .trim()
//       .toLowerCase();
//     const normalizedPhone = phone.trim();
//     const normalizedCacNumber = cacNumber.trim();
//     const normalizedBusinessAddress = businessAddress.trim();
//     const normalizedTagline = tagline?.trim() || null;

//     // ============================================================
//     // 6. Generate dealership slug
//     // ============================================================

//     const baseSlug = normalizedBusinessName
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/^-+|-+$/g, "");

//     const businessSlug = `${baseSlug}-${crypto.randomUUID()
//       .replace(/-/g, "")
//       .substring(0, 8)}`;

//       const verificationRequest =
//   await tx.verificationRequest.create({
//     data: {
//       user: {
//         connect: {
//           id: user.id,
//         },
//       },

//       legalName: normalizedBusinessName,
//       businessAddress: normalizedBusinessAddress,
//       cacNumber: normalizedCacNumber,

//       status: "PENDING",

//       documents: {
//         create: documents.map((doc) => ({
//           type: doc.type,
//           url: doc.url.trim(),
//         })),
//       },
//     },

//     select: {
//       id: true,
//       status: true,
//     },
//   });


//     const updatedUser = await db.$transaction(async (tx) => {
//       //get current applicant or existing user
//       const existingUser = await tx.user.findUnique({
//         where: {
//           id: user.id,
//         },
//         select: {
//           id: true,
//           role: true,
//           onboardingComplete: true,
//           privateListingLimit: true,

//           dealerProfile: {
//             select: {
//               id: true,
//             },
//           },

//           verificationRequest: {
//             select: {
//               id: true,
//               status:true
//             },
//           },
//         },
//       });

//       if (!existingUser) {
//         throw new Error("User profile not found.");
//       }

//       // ----------------------------------------------------------
//       // Prevent duplicate dealer onboarding
//       // ----------------------------------------------------------

//       if (existingUser.role === "DEALER") {
//         throw new Error(
//           "This account is already registered as a dealer."
//         );
//       }

//       if (existingUser.dealerProfile) {
//         throw new Error(
//           "A dealer profile already exists for this account."
//         );
//       }

//       if (existingUser.verificationRequest) {
//         throw new Error(
//           "A dealership verification request already exists."
//         );
//       }

//       // Capture remaining private listing allowance

//       const remainingPrivateListing =
//         existingUser.privateListingLimit;


//       const dealerProfile = await tx.dealerProfile.create({
//         data: {
//           businessName: normalizedBusinessName,
//           slug: businessSlug,
//           phone: normalizedPhone,
//           businessEmail: normalizedBusinessEmail,
//           tagline: normalizedTagline,
//           logo: businessCard.url.trim(),

//           user: {
//             connect: {
//               id: user.id,
//             },
//           },
//         },

//         select: {
//           id: true,
//           listingLimits: true,
//         },
//       });

//       // ----------------------------------------------------------
//       // Transfer private listing allowance to the dealer listings limit
    

//       if (remainingPrivateListing > 0) {
//         await tx.dealerProfile.update({
//           where: {
//             id: dealerProfile.id,
//           },

//           data: {
//             listingLimits: {
//               increment: remainingPrivateListing,
//             },
//           },
//         });
//       }

//       // ----------------------------------------------------------
//       // Update User
//       // ----------------------------------------------------------

//       const updatedUser = await tx.user.update({
//         where: {
//           id: user.id,
//         },

//         data: {
//           role: "DEALER",
//           onboardingComplete: true,
//           phone: normalizedPhone,

//           // Private allowance has been transferred
//           privateListingLimit: 0,

//           // ------------------------------------------------------
//           // Create verification request
//           // ------------------------------------------------------

//           verificationRequest: {
//             create: {
//               legalName: normalizedBusinessName,
//               businessAddress: normalizedBusinessAddress,
//               cacNumber: normalizedCacNumber,

//               documents: {
//                 create: documents.map((doc) => ({
//                   type: doc.type,
//                   url: doc.url.trim(),
//                 })),
//               },
//             },
//           },
//         },

//         select: {
//           id: true,
//           role: true,
//           onboardingComplete: true,
//         },
//       });

//       return updatedUser;
//     });

//     // ============================================================
//     // 8. Synchronize Supabase Auth metadata
//     //
//     // Prisma is authoritative.
//     // Supabase metadata acts as an authorization cache.
//     // ============================================================

//     const { error: metadataError } =
//       await supabaseAdmin.auth.admin.updateUserById(user.id, {
//         user_metadata: {
//           role: updatedUser.role,
//           onboardingComplete:
//             updatedUser.onboardingComplete,
//         },
//       });

//     if (metadataError) {
//       console.error(
//         "[SUPABASE_METADATA_SYNC_FAILED]",
//         metadataError
//       );

//       return NextResponse.json(
//         {
//           message:
//             "Dealer account was created, but authentication metadata failed to synchronize.",
//         },
//         { status: 500 }
//       );
//     }

//     // ============================================================
//     // 9. Success
//     // ============================================================

//     return NextResponse.json(
//       {
//         success: true,
//         message:
//           "Dealer onboarding completed successfully.",

//         user: {
//           id: updatedUser.id,
//           role: updatedUser.role,
//           onboardingComplete:
//             updatedUser.onboardingComplete,
//         },
//       },
//       {
//         status: 200,
//       }
//     );
//   } catch (error) {
//     console.error(
//       "[DEALER_ONBOARDING_CRASH]",
//       error
//     );

//     return NextResponse.json(
//       {
//         message:
//           error instanceof Error
//             ? error.message
//             : "Internal server error.",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }
 
import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma";
import { createClient } from "@/supabase/server";

interface IncomingDocument {
  type: "GOVT_ID" | "BUSINESS_CARD" | "CAC_CERTIFICATE";
  url: string;
}

interface OnboardingRequestBody {
  businessName: string;
  businessEmail: string;
  phone: string;
  cacNumber: string;
  businessAddress: string;
  tagline?: string;
  documents: IncomingDocument[];
}

export async function POST(req: Request) {
  try {
  
    // 1. Authenticate user
  

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized session.",
        },
        { status: 401 }
      );
    }

  console.log('user',user)
    // 2. Parse request body
  

    let body: OnboardingRequestBody;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          message: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const {
      businessName,
      businessEmail,
      phone,
      cacNumber,
      businessAddress,
      tagline,
      documents,
    } = body;

  
    // 3. Validate dealership information
  

    if (
      typeof businessName !== "string" ||
      !businessName.trim() ||
      typeof businessEmail !== "string" ||
      !businessEmail.trim() ||
      typeof phone !== "string" ||
      !phone.trim() ||
      typeof cacNumber !== "string" ||
      !cacNumber.trim() ||
      typeof businessAddress !== "string" ||
      !businessAddress.trim()
    ) {
      return NextResponse.json(
        {
          message: "Missing required dealership information.",
        },
        { status: 400 }
      );
    }


    if (!Array.isArray(documents) || documents.length < 2) {
      return NextResponse.json(
        {
          message: "At least two verification documents are required.",
        },
        { status: 400 }
      );
    }

    const validDocumentTypes = new Set([
      "GOVT_ID",
      "BUSINESS_CARD",
      "CAC_CERTIFICATE",
    ]);

    const invalidDocument = documents.some((doc) => {
      return (
        !doc ||
        !validDocumentTypes.has(doc.type) ||
        typeof doc.url !== "string" ||
        !doc.url.trim()
      );
    });

    if (invalidDocument) {
      return NextResponse.json(
        {
          message: "One or more verification documents are invalid.",
        },
        { status: 400 }
      );
    }


    const govtId = documents.find(
      (doc) => doc.type === "GOVT_ID"
    );

    const businessCard = documents.find(
      (doc) => doc.type === "BUSINESS_CARD"
    );

    if (!govtId || !businessCard) {
      return NextResponse.json(
        {
          message:
            "Government ID and business card are required for verification.",
        },
        { status: 400 }
      );
    }

  
    // 6. Normalize input
  

    const normalizedBusinessName = businessName.trim();

    const normalizedBusinessEmail = businessEmail
      .trim()
      .toLowerCase();

    const normalizedPhone = phone.trim();

    const normalizedCacNumber = cacNumber.trim();

    const normalizedBusinessAddress =
      businessAddress.trim();

    const normalizedTagline =
      typeof tagline === "string" && tagline.trim()
        ? tagline.trim()
        : null;

    
    // - User remains USER
    // - No DealerProfile is created
    // - No listing limits are transferred
    // - onboardingComplete is NOT changed
    // Admin approval will handle promotion to DEALER.


    const verificationRequest =
      await db.$transaction(async (tx) => {

        const existingUser = await tx.user.findUnique({
          where: {
            id: user.id,
          },

          select: {
            id: true,
            role: true,
            onboardingComplete: true,

            dealerProfile: {
              select: {
                id: true,
              },
            },

            verificationRequest: {
              select: {
                id: true,
                status: true,
              },
            },
          },
        });

        if (!existingUser) {
          throw new Error("User profile not found.");
        }

        // --------------------------------------------------------
        // User is already a dealer

        if (existingUser.role === "DEALER") {
          throw new Error(
            "This account is already registered as a dealer."
          );
        }

        // Dealer profile should not already exist

        if (existingUser.dealerProfile) {
          throw new Error(
            "A dealer profile already exists for this account."
          );
        }

        // Existing verification request

        if (existingUser.verificationRequest) {
          const status =
            existingUser.verificationRequest.status;

          if (status === "SUBMITTED") {
            throw new Error(
              "A dealership verification request is already pending."
            );
          }

          if (status === "APPROVED") {
            throw new Error(
              "This dealership verification request has already been approved."
            );
          }

          // REJECTED:
          // rejected users resubmission will be decided later
          // prevent duplicates.
          if (status === "REJECTED") {
            throw new Error(
              "A previous dealership verification request was rejected."
            );
          }
        }

        // Create verification request

        const request =
          await tx.verificationRequest.create({
            data: {
              legalName: normalizedBusinessName,
              businessEmail:normalizedBusinessEmail,
              businessAddress:
                normalizedBusinessAddress,
              cacNumber: normalizedCacNumber,
              phone:normalizedPhone,
              tagline:normalizedTagline,

              // Explicitly pending
              status: "SUBMITTED",

              user: {
                connect: {
                  id: existingUser.id,
                },
              },

              documents: {
                create: documents.map((doc) => ({
                  type: doc.type,
                  url: doc.url.trim(),
                })),
              },
            },

            select: {
              id: true,
              status: true,
              createdAt: true,
            },
          });

        return request;
      });

    // 8. Success

    return NextResponse.json(
      {
        success: true,

        message:
          "Your dealership verification request has been submitted and is awaiting admin review.",

        verificationRequest: {
          id: verificationRequest.id,
          status: verificationRequest.status,
          createdAt: verificationRequest.createdAt,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "[DEALER_VERIFICATION_REQUEST_ERROR]",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}


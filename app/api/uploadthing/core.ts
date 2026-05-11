import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // 1. Log this so you can see it in your TERMINAL
      console.log("✅ SERVER: Upload complete for:", metadata.userId);
      console.log("✅ SERVER: File URL:", file.url);

      // 2. CRITICAL: Return an object. 
      // Even if you don't save to DB here, you MUST return something.
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

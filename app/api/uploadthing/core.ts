import { createUploadthing, type FileRouter } from "uploadthing/next";
import { createClient } from "@/supabase/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // 💡 SWAPPED: Read session via Supabase server client instance
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Unauthorized");
      
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ SERVER: Upload complete for:", metadata.userId);
      console.log("✅ SERVER: File URL:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Listing new car thumbnail
  carThumbnail: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Unauthorized");
      
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("🏎️ THUMBNAIL UPLOADED:", file.url);
      return { url: file.url, uploadedBy: metadata.userId };
    }),

  // --- CAR LISTING GALLERY ---
  carGallery: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .middleware(async () => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Unauthorized");
      
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("📸 GALLERY IMAGE UPLOADED:", file.url);
      return { url: file.url, uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

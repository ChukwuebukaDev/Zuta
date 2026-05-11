import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

// We use the full URL to ensure the client-to-server 
// "Success" signal doesn't get lost in your proxy.ts
export const UploadButton = generateUploadButton<OurFileRouter>({
  url: "http://localhost:3000",
});

export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url: "http://localhost:3000",
});
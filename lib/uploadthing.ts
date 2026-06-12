import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const UploadButton = generateUploadButton<OurFileRouter>({
  url: baseUrl,
});

export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url: baseUrl,
});
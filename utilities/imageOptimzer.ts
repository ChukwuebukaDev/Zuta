import imageCompression from "browser-image-compression";

const options = {
  maxSizeMB: 1, // Max file size (Zuta standard: 1MB for high quality)
  maxWidthOrHeight: 1920, // Max resolution (Full HD)
  useWebWorker: true, // Offload to background thread (keeps UI smooth)
  initialQuality: 0.8, // 80% quality is the sweet spot for visual/size
};

export async function optimizeImage(file: File) {
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Image compression failed, using original file", error);
    return file; // Fallback to original if compression fails
  }
}

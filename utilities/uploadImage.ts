export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "zuta_car_upload"); // Cloudinary preset
  const res = await fetch("http://localhost:8000/upload-image", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Upload failed", data);
    throw new Error(data.error || "Upload failed");
  }
  return data.url;
}

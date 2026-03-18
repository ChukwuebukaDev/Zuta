export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "zuta_car_upload"); // Cloudinary preset
  const res = await fetch(
    "https://api.cloudinary.com/v1_1/due6b5ac3/image/upload",
    {
      method: "POST",
      body: formData,
    },
  );
  const data = await res.json();
  return data.secure_url; // URL of uploaded image
}

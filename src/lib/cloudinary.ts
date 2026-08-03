import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export interface CloudinaryUploadOptions {
  folder?: string;
  publicId?: string;
}

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

/**
 * Uploads a base64 data-URL image to Cloudinary and returns the
 * secure CDN URL plus public id.
 */
export async function uploadImage(
  dataUrl: string,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }

  const result = await cloudinary.v2.uploader.upload(dataUrl, {
    folder: options.folder ?? "zhanna/products",
    public_id: options.publicId,
    resource_type: "image",
    transformation: [
      { width: 1200, crop: "limit", fetch_format: "auto", quality: "auto" },
    ],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

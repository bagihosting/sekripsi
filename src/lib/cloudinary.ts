
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadToCloudinary(fileUri: string, folder: string) {
  try {
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: folder,
      invalidate: true,
    });
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Gagal mengunggah file ke Cloudinary.');
  }
}

export { cloudinary };

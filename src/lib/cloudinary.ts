
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export async function uploadToCloudinary(fileUri: string, folder: string) {
  try {
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: folder,
      invalidate: true,
      resource_type: 'auto',
      max_bytes: MAX_FILE_SIZE,
    });
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Gagal mengunggah file. Pastikan file tidak melebihi 5MB dan formatnya didukung.');
  }
}

export { cloudinary };

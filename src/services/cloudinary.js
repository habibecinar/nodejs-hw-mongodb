import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";

// Configure Cloudinary lazily when needed
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
};

/**
 * Dosyayi Cloudinary'ye upload eder
 * @param {string} filePath - Upload edilecek dosyanin local path'i
 * @param {string} folder - Cloudinary'de hangi klasore upload edilecek
 * @returns {Promise<string>} - Upload edilen dosyanin URL'i
 */
export const uploadToCloudinary = async (filePath, folder = "contacts") => {
  try {
    // Configure Cloudinary with environment variables
    configureCloudinary();
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: "auto", // otomatik dosya tipi tespiti
      transformation: [
        { width: 500, height: 500, crop: "limit" }, // maksimum boyut siniri
        { quality: "auto" }, // otomatik kalite optimizasyonu
        { format: "auto" } // otomatik format optimizasyonu (webp vs.)
      ]
    });

    // Upload basarili olduktan sonra local dosyayi sil
    await fs.unlink(filePath);

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    // Hata durumunda local dosyayi temizle
    try {
      await fs.unlink(filePath);
    } catch (unlinkError) {
      console.error("Error deleting temp file:", unlinkError);
    }
    throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
  }
};

/**
 * Cloudinary'den dosya siler
 * @param {string} imageUrl - Silinecek dosyanin URL'i
 * @returns {Promise<void>}
 */
export const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Configure Cloudinary with environment variables
    configureCloudinary();

    // URL'den public_id'yi çıkar
    const urlParts = imageUrl.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = `contacts/${publicIdWithExtension.split('.')[0]}`;

    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted image from Cloudinary: ${publicId}`);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    // Silme hatasi kritik degil, sadece log'la
  }
};

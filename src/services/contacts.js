import Contact from "../models/Contact.js";
import { uploadToCloudinary, deleteFromCloudinary } from "./cloudinary.js";

// Tüm contactları (sayfalama + sıralama + filtreleme) getir
export const getAllContactsService = async ({
  page = 1,
  perPage = 10,
  sortBy = "name",
  sortOrder = "asc",
  filter = {},
}) => {
  const pageNum = Number(page) > 0 ? Number(page) : 1;
  const limit = Number(perPage) > 0 ? Number(perPage) : 10;
  const skip = (pageNum - 1) * limit;

  // Sadece izin verilen alanlara göre sıralama (güvenlik için)
  const ALLOWED_SORT_FIELDS = ["name", "email", "createdAt"];
  const sortField = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : "name";
  const sortDir = sortOrder === "desc" ? -1 : 1;

  const [data, totalItems] = await Promise.all([
    Contact.find(filter)
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(limit)
      .lean(),
    Contact.countDocuments(filter),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return {
    data,
    page: pageNum,
    perPage: limit,
    totalItems,
    totalPages,
    hasPreviousPage: pageNum > 1,
    hasNextPage: pageNum < totalPages,
  };
};

// ID ile contact getir
export const getContactByIdService = async (contactId) => {
  return await Contact.findById(contactId);
};

// Yeni contact oluştur
export const createContactService = async (contactData, photoFile = null) => {
  // Eger foto dosyasi varsa Cloudinary'ye upload et
  if (photoFile) {
    try {
      const photoUrl = await uploadToCloudinary(photoFile.path);
      contactData.photo = photoUrl;
    } catch (error) {
      console.error("Photo upload failed:", error);
      throw new Error("Failed to upload photo");
    }
  }

  const contact = new Contact(contactData);
  return await contact.save();
};

// Contact güncelle
export const updateContactService = async (contactId, updatedData, userId, photoFile = null) => {
  // Mevcut contact'i al
  const existingContact = await Contact.findOne({ _id: contactId, userId });
  if (!existingContact) {
    return null;
  }

  // Eger yeni foto dosyasi varsa
  if (photoFile) {
    try {
      // Eski fotoyu sil (varsa)
      if (existingContact.photo) {
        await deleteFromCloudinary(existingContact.photo);
      }
      
      // Yeni fotoyu upload et
      const photoUrl = await uploadToCloudinary(photoFile.path);
      updatedData.photo = photoUrl;
    } catch (error) {
      console.error("Photo upload failed:", error);
      throw new Error("Failed to upload photo");
    }
  }

  return await Contact.findByIdAndUpdate(contactId, updatedData, {
    new: true,
  });
};

// Contact sil
export const deleteContactService = async (contactId, userId) => {
  // Mevcut contact'i al
  const existingContact = await Contact.findOne({ _id: contactId, userId });
  if (!existingContact) {
    return null;
  }

  // Eger foto varsa Cloudinary'den sil
  if (existingContact.photo) {
    await deleteFromCloudinary(existingContact.photo);
  }

  return await Contact.findByIdAndDelete(contactId);
};

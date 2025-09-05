import Contact from "../models/Contact.js";

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
export const createContactService = async (contactData) => {
  const contact = new Contact(contactData);
  return await contact.save();
};

// Contact güncelle
export const updateContactService = async (contactId, updatedData) => {
  return await Contact.findByIdAndUpdate(contactId, updatedData, {
    new: true,
  });
};

// Contact sil
export const deleteContactService = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};

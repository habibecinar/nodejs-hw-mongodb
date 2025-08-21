import Contact from "../models/Contact.js";

export const getAllContactsService = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactByIdService = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};
export const createContactService = async (contactData) => {
  const contact = new Contact(contactData);
  return await contact.save();
};
export const updateContactService = async (contactId, updatedData) => {
  // findByIdAndUpdate, güncellenmiş dökümanı döndürmesi için { new: true } kullanılır
  const updatedContact = await Contact.findByIdAndUpdate(contactId, updatedData, { new: true });

  return updatedContact;
};
export const deleteContactService = async (contactId) => {
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  return deletedContact;
};
export const findContacts = async ({ page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', filter = {} }) => {
const pageNum = Number(page) > 0 ? Number(page) : 1;
const limit = Number(perPage) > 0 ? Number(perPage) : 10;
const skip = (pageNum - 1) * limit;


// Sadece izin verilen alanlara göre sıralama (güvenlik)
const ALLOWED_SORT_FIELDS = ['name']; // gerekirse ['name','email','createdAt'] gibi genişletin
const sortField = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'name';
const sortDir = sortOrder === 'desc' ? -1 : 1;


const totalItems = await Contact.countDocuments(filter);
const data = await Contact.find(filter)
.sort({ [sortField]: sortDir })
.skip(skip)
.limit(limit)
.lean();


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
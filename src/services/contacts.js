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
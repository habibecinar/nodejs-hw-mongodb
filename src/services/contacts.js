import Contact from "../models/Contact.js";

export const getAllContactsService = async () => {
  const contacts = await Contact.find();
  return contacts;
};

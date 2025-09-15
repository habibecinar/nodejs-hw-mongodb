import createError from "http-errors";
import Contact from "../models/Contact.js"; // insertMany kullanabilmek için
import {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  updateContactService,
  deleteContactService,
} from "../services/contacts.js";
import { uploadToCloudinary } from "../services/cloudinary.js";

// GET /contacts  (pagination + sort + filter)
export const getAllContactsController = async (req, res, next) => {
  try {
    const userId = req.user.id; // authenticate middleware ile geldi

    const {
      page = 1,
      perPage = 10,
      sortBy = "name",
      sortOrder = "asc",
      type,
      isFavourite,
    } = req.query;

    const filter = { userId }; // userId filtreye ekleniyor
    if (type) filter.contactType = type;
    if (typeof isFavourite !== "undefined") {
      filter.isFavourite = String(isFavourite).toLowerCase() === "true";
    }

    const result = await getAllContactsService({
      page: Number(page),
      perPage: Number(perPage),
      sortBy,
      sortOrder,
      filter,
    });

    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// GET /contacts/:contactId
export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user.id; // sadece kendi kontaklarını al
    const contact = await getContactByIdService(contactId, userId);
    if (!contact) {
      return next(createError(404, "Contact not found"));
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// POST /contacts
export const createContactController = async (req, res, next) => {
  try {
    const userId = req.user.id; 

    let newContacts;

    // Multipart/form-data ile tek dosya upload
    if (req.file || !Array.isArray(req.body)) {
      // Tek contact ise → normal servis üzerinden ekle
      const contactData = { ...req.body, userId };
      
      // Photo file varsa service'e gönder
      newContacts = await createContactService(contactData, req.file);
    } else if (Array.isArray(req.body)) {
      // Bulk upload (array) - bu durumda photo upload desteklenmez
      const contactsData = req.body.map(contact => ({
        ...contact,
        userId,
      }));
      newContacts = await Contact.insertMany(contactsData);
    }

    res.status(201).json({
      status: 201,
      message: "Successfully created contact(s)!",
      data: newContacts,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /contacts/:contactId
export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user.id; // sadece kendi kontaklarını güncelle
    
    // Photo file varsa service'e gönder
    const updatedContact = await updateContactService(contactId, req.body, userId, req.file);

    if (!updatedContact) {
      return next(createError(404, "Contact not found"));
    }

    res.status(200).json({
      status: 200,
      message: "Successfully patched a contact!",
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /contacts/:contactId
export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user.id; // sadece kendi kontaklarını silebilir
    const deletedContact = await deleteContactService(contactId, userId);

    if (!deletedContact) {
      return next(createError(404, "Contact not found"));
    }

    res.status(200).json({
      status: 200,
      message: "Successfully deleted a contact!",
      data: deletedContact,
    });
  } catch (error) {
    next(error);
  }
};

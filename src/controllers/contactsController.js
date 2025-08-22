import createError from "http-errors";
import {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  updateContactService,
  deleteContactService,
} from "../services/contacts.js";

// GET /contacts  (pagination + sort + filter)
export const getAllContactsController = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = "name",
      sortOrder = "asc",
      type,
      isFavourite,
    } = req.query;

    const filter = {};
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
    const contact = await getContactByIdService(contactId);
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
    const newContact = await createContactService(req.body);
    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /contacts/:contactId
export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await updateContactService(contactId, req.body);

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
    const deletedContact = await deleteContactService(contactId);

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

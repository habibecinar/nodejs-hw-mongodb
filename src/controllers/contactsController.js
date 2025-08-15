import { getAllContactsService, getContactByIdService , createContactService, updateContactService, deleteContactService,} from "../services/contacts.js";
import createError from 'http-errors';

export const getAllContactsController = async (req, res) => {
	try {
		const contacts = await getAllContactsService();
		res.status(200).json({
			status: 200,
			message: "Successfully found contacts!",
			data: contacts,
		});
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: "Failed to retrieve contacts",
			error: error.message,
		});
	}
	
};
export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactByIdService(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
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
export const createContactController = async (req, res, next) => {
   console.log('Request Body:', req.body);
  try {
    const newContact = await createContactService(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};
export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedData = req.body;

    // Güncellenmiş iletişim bilgilerini al
    const updatedContact = await updateContactService(contactId, updatedData);

    if (!updatedContact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
        data: null,
      });
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
export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await deleteContactService(contactId);

    if (!deletedContact) {
      return next(createError(404, 'Contact not found'));
    }

    res.status(204).send();  // Başarılı silme, içerik yok
  } catch (error) {
    next(error);
  }
};
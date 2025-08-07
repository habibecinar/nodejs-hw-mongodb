import { getAllContactsService } from "../services/contacts.js";

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

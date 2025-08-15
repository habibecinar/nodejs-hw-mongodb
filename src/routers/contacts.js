import express from 'express';
import { getAllContactsController, getContactByIdController, createContactController, updateContactController , deleteContactController,   } from '../controllers/contactsController.js';

const router = express.Router();

router.get('/', getAllContactsController);
router.get('/:contactId', getContactByIdController);
router.post('/', createContactController);
router.patch('/:contactId', updateContactController);
router.delete('/:contactId', deleteContactController); 
export default router;

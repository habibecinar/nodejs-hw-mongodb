import express from 'express';
import { getAllContactsController, getContactByIdController, createContactController, updateContactController , deleteContactController,  } from '../controllers/contactsController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../validators/contactSchemas.js';
const router = express.Router();
import { authenticate } from "../middlewares/authenticate.js";

router.use(authenticate);

router.get('/', getAllContactsController);
router.get('/:contactId',isValidId(), getContactByIdController);
router.post('/', validateBody(createContactSchema), createContactController);
router.patch('/:contactId', isValidId(), validateBody(updateContactSchema), updateContactController);
router.delete('/:contactId', isValidId(), deleteContactController);
// Tüm rotalara authentication ekliyoruz


router.get("/", getAllContactsController);
router.post("/", createContactController);

export default router;

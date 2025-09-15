import express from 'express';
import { 
  getAllContactsController, 
  getContactByIdController, 
  createContactController, 
  updateContactController, 
  deleteContactController 
} from '../controllers/contactsController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../validators/contactSchemas.js';
import { authenticate } from "../middlewares/authenticate.js";
import { uploadSingle, handleMulterError } from "../middlewares/upload.js";

const router = express.Router();

// Tüm rotalara authentication ekliyoruz
router.use(authenticate);

// GET /contacts - Tüm kontakları getir
router.get('/', getAllContactsController);

// GET /contacts/:contactId - Belirli bir kontağı getir
router.get('/:contactId', isValidId(), getContactByIdController);

// POST /contacts - Yeni kontak oluştur (photo upload destekli)
router.post('/', 
  uploadSingle, // Multer middleware - multipart/form-data desteği
  handleMulterError, // Multer hata handling
  validateBody(createContactSchema), 
  createContactController
);

// PATCH /contacts/:contactId - Kontak güncelle (photo upload destekli)
router.patch('/:contactId', 
  isValidId(), 
  uploadSingle, // Multer middleware - multipart/form-data desteği
  handleMulterError, // Multer hata handling
  validateBody(updateContactSchema), 
  updateContactController
);

// DELETE /contacts/:contactId - Kontak sil
router.delete('/:contactId', isValidId(), deleteContactController);

export default router;

import { Router } from "express";
import { registerUserController } from "../controllers/auth.js";

const router = Router();

// Yeni kullanıcı kaydı
router.post("/register", registerUserController);

export default router;

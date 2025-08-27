import { Router } from "express";
import { registerUserController } from "../controllers/auth.js";
import { registerSchema } from "../validators/auth.js";
import { validate } from "../validators/auth.js";

const router = Router();

router.post("/register", validate(registerSchema), registerUserController);

export default router;

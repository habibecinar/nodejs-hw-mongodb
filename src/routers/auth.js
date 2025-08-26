import { Router } from "express";
import { registerUserController } from "../controllers/auth.js";
import { registerSchema } from "../validation/auth.js";
import { validate } from "../validation/validate.js";

const router = Router();

router.post("/register", validate(registerSchema), registerUserController);

export default router;

import { Router } from "express";
import { registerUserController,loginUserController } from "../controllers/auth.js";
import { registerSchema,loginSchema} from "../validators/auth.js";
import { validate } from "../validators/auth.js";
import { refreshSessionController } from "../controllers/auth.js";
const router = Router();

router.post("/register", validate(registerSchema), registerUserController);
router.post("/login", validate(loginSchema), loginUserController);
// Refresh token ile oturumu yenile
router.post("/refresh", refreshSessionController);
export default router;

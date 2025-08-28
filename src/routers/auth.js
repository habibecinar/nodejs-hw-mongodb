import { Router } from "express";
import { 
  registerUserController, 
  loginUserController, 
  refreshSessionController, 
  logoutUserController 
} from "../controllers/auth.js";

import { registerSchema, loginSchema, validate } from "../validators/auth.js";

const router = Router();

router.post("/register", validate(registerSchema), registerUserController);
router.post("/login", validate(loginSchema), loginUserController);
router.post("/refresh", refreshSessionController);
router.post("/logout", logoutUserController);

export default router;

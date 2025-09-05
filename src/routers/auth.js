import { Router } from "express";
import { 
  registerUserController, 
  loginUserController, 
  refreshSessionController, 
  logoutUserController ,
  sendResetEmailController,
  resetPasswordController,
  
} from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { sendResetSchema, resetPasswordSchema,} from "../validators/auth.js";


import { registerSchema, loginSchema, validate } from "../validators/auth.js";

const router = Router();

router.post("/register", validate(registerSchema), registerUserController);
router.post("/login", validate(loginSchema), loginUserController);
router.post("/refresh", refreshSessionController);
router.post("/logout", logoutUserController);
router.post("/send-reset-email", validateBody(sendResetSchema), sendResetEmailController);
router.post("/reset-pwd", validateBody(resetPasswordSchema), resetPasswordController);
export default router;
//
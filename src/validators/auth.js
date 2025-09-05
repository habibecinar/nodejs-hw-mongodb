import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
export default { registerSchema };

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Şifre sıfırlama maili göndermek için
export const sendResetSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Şifreyi gerçekten sıfırlamak için
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).max(50).required(),
});
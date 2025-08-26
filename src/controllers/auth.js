import { registerUser } from "../services/auth.js";

export const registerUserController = async (req, res, next) => {
  try {
    // Kullanıcıyı servis katmanında oluştur
    const user = await registerUser(req.body);

    // user null değilse, şifreyi response'tan çıkar
    const userObj = user.toObject ? user.toObject() : user;
    const { password, ...userWithoutPassword } = userObj;

    // Başarılı yanıt
    res.status(201).json({
      status: 201,
      message: "Successfully registered a user!",
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error); // Hataları error handling middleware'e gönder
  }
};

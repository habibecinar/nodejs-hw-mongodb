import { registerUser,loginUser} from "../services/auth.js";
import { refreshSession } from "../services/auth.js";
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
export const loginUserController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body);

    // Refresh token cookie olarak gönderilir
    res.cookie("refreshToken", session.refreshToken, {
      httpOnly: true,
      secure: true, // production'da true olmalı
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
    });

    res.status(200).json({
      status: 200,
      message: "Successfully logged in an user!",
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const refreshSessionController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ status: 401, message: "Refresh token missing" });
    }

    const session = await refreshSession(refreshToken);

    res.cookie("refreshToken", session.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
    });

    res.status(200).json({
      status: 200,
      message: "Successfully refreshed a session!",
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};


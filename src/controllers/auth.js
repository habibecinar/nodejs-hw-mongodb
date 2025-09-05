import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import UsersCollection from "../models/user.js";
import { deleteSessionByUserId ,registerUser,loginUser,logoutUser} from "../services/auth.js";
import { sendEmail } from "../services/emailService.js";
import { refreshSession } from "../services/auth.js";
import bcrypt from "bcrypt";

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


export const logoutUserController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    await logoutUser(refreshToken);

    // Cookie temizle
    res.clearCookie("refreshToken");

    // 204 döndür (no content)
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;

    // 1. Body doğrulama
    if (!email) {
      throw createHttpError(400, "Email is required!");
    }

    // 2. Kullanıcıyı bul
    const user = await UsersCollection.findOne({ email });
    if (!user) {
      throw createHttpError(404, "User not found!");
    }

    // 3. Token üret (5 dakika geçerli)
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    // 4. Link oluştur
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    // 5. Mail gönder
    await sendEmail(
      user.email,
      "Şifre Sıfırlama",
      `<p>Şifre sıfırlamak için <a href="${resetLink}">buraya tıkla</a>. Link 5 dakika geçerlidir.</p>`
    );

    // 6. Response döndür
    res.status(200).json({
      status: 200,
      message: "Reset password email has been successfully sent.",
      data: {},
    });
  } catch (error) {
    console.log("[sendResetEmailController] Hata:", error);
    if (error.message && error.message.includes("Failed to send the email")) {
      return next(createHttpError(500, "Failed to send the email, please try again later."));
    }
    next(error);
  }
};
//ADIM 4: Şifre sıfırlama
export const resetPasswordController = async (req, res, next) => {
  try {
    // ✅ Body ve alan kontrolü burada yapılır
    if (!req.body) throw createHttpError(400, "Body is missing!");
    const { token, password } = req.body;
    if (!token || !password) throw createHttpError(400, "Token and password are required");

    // Token doğrulama
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return next(createHttpError(401, "Token is expired or invalid."));
    }

    // Kullanıcıyı bul
    const user = await UsersCollection.findOne({ email: payload.email });
    if (!user) throw createHttpError(404, "User not found!");

    //  Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Şifreyi güncelle
    user.password = hashedPassword;
    await user.save();

    // Oturumları sil
    await deleteSessionByUserId(user._id);

    res.status(200).json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

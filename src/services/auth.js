import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

import { UsersCollection } from "../models/user.js";
import { SessionsCollection } from "../models/session.js";


// Token süreleri
const FIFTEEN_MINUTES = 15 * 60 * 1000;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

// -------------------- REGISTER --------------------
export const registerUser = async (payload) => {
  const { name, email, password } = payload;

  // aynı email var mı kontrol
  const existingUser = await UsersCollection.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, "Email in use");
  }

  // şifreyi hashle
  const hashedPassword = await bcrypt.hash(password, 10);

  // yeni kullanıcı oluştur
  const newUser = await UsersCollection.create({
    name,
    email,
    password: hashedPassword,
  });

  // şifreyi geri göndermiyoruz!
  const userWithoutPassword = newUser.toObject();
  delete userWithoutPassword.password;

  return userWithoutPassword;
};

// -------------------- LOGIN --------------------
export const loginUser = async (payload) => {
  const { email, password } = payload;

  // kullanıcı var mı kontrol
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, "Invalid email or password");
  }

  // şifre doğru mu kontrol et
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, "Invalid email or password");
  }

  // varsa eski session sil
  await SessionsCollection.deleteOne({ userId: user._id });

  // yeni token üret
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  // session kaydet
  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() +THIRTY_DAYS),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });

  return session;
};
// -------------------- REFRESH SESSION --------------------
export const refreshSession = async (refreshToken) => {
  // Geçerli session var mı kontrol et
  const oldSession = await SessionsCollection.findOne({ refreshToken });
  if (!oldSession) {
    throw createHttpError(401, "Invalid refresh token");
  }

  // Eski session’u sil
  await SessionsCollection.deleteOne({ _id: oldSession._id });

  // Yeni token üret
  const accessToken = randomBytes(30).toString("base64");
  const newRefreshToken = randomBytes(30).toString("base64");

  const newSession = await SessionsCollection.create({
    userId: oldSession.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });

  return newSession;
};
export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, "Refresh token missing");
  }

  // Token’a bağlı session varsa sil
  await SessionsCollection.deleteOne({ refreshToken });
};

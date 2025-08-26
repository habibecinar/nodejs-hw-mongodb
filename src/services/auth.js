import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { UsersCollection } from "../db/models/user.js";

export const registerUser = async (payload) => {
  const { name, email, password } = payload;

  // Aynı email daha önce kayıtlı mı kontrol et
  const existingUser = await UsersCollection.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, "Email in use");
  }

  // Şifreyi hashle
  const hashedPassword = await bcrypt.hash(password, 10);

  // Yeni kullanıcı oluştur
  const newUser = await UsersCollection.create({
    name,
    email,
    password: hashedPassword,
  });

  return newUser; // Controller içinde password'u kaldıracağız
};

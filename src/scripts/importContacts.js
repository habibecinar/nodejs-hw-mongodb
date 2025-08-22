import fs from "fs/promises";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Contact from "../models/Contact.js";

dotenv.config();

const run = async () => {
  try {
    // MongoDB bağlantısı
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/contacts_db";
    await mongoose.connect(uri);
    console.log("MongoDB connected ✅");

    // JSON dosyasını oku
    const data = await fs.readFile("./contacts.json", "utf-8");
    const contacts = JSON.parse(data);

    // Eğer istersen önce eski verileri temizle
    await Contact.deleteMany({});
    console.log("Eski veriler silindi ❌");

    // Yeni verileri ekle
    await Contact.insertMany(contacts);
    console.log("Yeni veriler eklendi 🚀");

    process.exit(0);
  } catch (error) {
    console.error("Import hatası ❌:", error.message);
    process.exit(1);
  }
};

run();

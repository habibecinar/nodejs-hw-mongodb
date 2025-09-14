import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // en üstte

export const initMongoConnection = async () => {
  try {
    // Debug: env değişkenlerini logla
    console.log("MONGODB_USER:", process.env.MONGODB_USER);
    console.log("MONGODB_PASSWORD:", process.env.MONGODB_PASSWORD);
    console.log("MONGODB_URL:", process.env.MONGODB_URL);
    console.log("MONGODB_DB:", process.env.MONGODB_DB);

  const uri = `mongodb+srv://${encodeURIComponent(
      process.env.MONGODB_USER
    )}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${
      process.env.MONGODB_URL
    }/${process.env.MONGODB_DB}`;

    await mongoose.connect(uri);
    console.log("MongoDB connected!");
  } catch (error) {
    console.error("Mongo connection failed:", error);
    process.exit(1);
  }
};

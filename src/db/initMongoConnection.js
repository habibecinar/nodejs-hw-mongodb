import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // en üstte

export const initMongoConnection = async () => {
  try {
    const uri = `mongodb+srv://${encodeURIComponent(process.env.MONGODB_USER)}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

    await mongoose.connect(uri);
    console.log("MongoDB connected!");
  } catch (error) {
    console.error("Mongo connection failed:", error);
    process.exit(1);
  }
};

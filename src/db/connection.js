// src/db/connection.js
import mongoose from 'mongoose';

export const connectMongo = async () => {
  try {
    const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/contacts_db';

    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB bağlantısı başarılı 🚀');
  } catch (error) {
    console.error('MongoDB bağlantı hatası ❌:', error.message);
    process.exit(1); // bağlantı başarısızsa uygulamayı durdur
  }
};

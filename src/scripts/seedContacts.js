import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { Contact } from '../models/Contact.js';

dotenv.config();

const seedContacts = async () => {
  try {
    const {
      MONGODB_USER,
      MONGODB_PASSWORD,
      MONGODB_URL,
      MONGODB_DB,
    } = process.env;

    const uri = `mongodb+srv://${encodeURIComponent(MONGODB_USER)}:${encodeURIComponent(MONGODB_PASSWORD)}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

    await mongoose.connect(uri);
    console.log('MongoDB connected for seeding...');

    // contacts.json dosyasını oku
    const dataPath = path.resolve('contacts.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const contacts = JSON.parse(data);

    // Varolan kayıtları temizle (opsiyonel)
    await Contact.deleteMany({});

    // Yeni verileri ekle
    await Contact.insertMany(contacts);

    console.log('Contacts seeded successfully!');
    process.exit(0); // İşlem tamam, çıkış yap

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedContacts();

import { model, Schema } from "mongoose";

// Kullanıcı şeması
 const usersSchema = new Schema(
  {
    name: {
      type: String,
      required: true, // isim zorunlu
    },
    email: {
      type: String,
      required: true, // email zorunlu
      unique: true,   // aynı email ile 2. kez kayıt olamaz
    },
    password: {
      type: String,
      required: true, // şifre zorunlu
    },
  },
  {
    timestamps: true, // createdAt & updatedAt otomatik eklenecek
    versionKey: false, // __v alanı çıkmasın
  }
);

// "users" koleksiyonunu oluşturuyoruz
 const UsersCollection = model("users", usersSchema);
  export default UsersCollection;

// src/models/contact.js
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      minlength: 3,
      maxlength: 20,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ["work", "home", "personal"],
      default: "personal",
      required: true,
    },
    photo: {
      type: String,
      default: null, // Cloudinary URL'ini saklayacak
    },
    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "users", // Hangi kullanıcıya ait olduğunu göstermek için
  required: true,
}

  },
  { timestamps: true, versionKey: false }
);

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;

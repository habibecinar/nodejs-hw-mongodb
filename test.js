// test.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // 587 için false
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendTestEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,  // Gönderen mail
      to: process.env.SMTP_FROM,    // Kendine gönder, test amaçlı
      subject: "Brevo SMTP Test Email",
      html: "<h2>Merhaba! Bu bir test mailidir ✅</h2>",
    });
    console.log("Email sent successfully:", info.messageId);
  } catch (err) {
    console.error("Failed to send email:", err);
  }
};

sendTestEmail();

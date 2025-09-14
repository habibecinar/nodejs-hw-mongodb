import nodemailer from "nodemailer";

// Transporter'ı lazy olarak oluştur
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true olursa port 465 olmalı
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    // IPv6 problemini çözmek için
    family: 4, // IPv4 kullan
    // Debug için
    debug: true,
    logger: true,
  });
};

// SMTP bağlantısını test et
export const testSMTPConnection = async () => {
  try {
    console.log("Testing SMTP connection...");
    console.log("SMTP_HOST from env:", process.env.SMTP_HOST);
    console.log("SMTP_PORT from env:", process.env.SMTP_PORT);
    console.log("SMTP_USER from env:", process.env.SMTP_USER);
    console.log("SMTP_FROM from env:", process.env.SMTP_FROM);
    
    const transporter = createTransporter();
    await transporter.verify();
    console.log("SMTP connection is ready!");
    return true;
  } catch (error) {
    console.error("SMTP connection failed:", error);
    return false;
  }
};

export const sendEmail = async (to, subject, html) => {
  try {
    console.log("SMTP Configuration:");
    console.log("Host:", process.env.SMTP_HOST);
    console.log("Port:", process.env.SMTP_PORT);
    console.log("User:", process.env.SMTP_USER);
    console.log("From:", process.env.SMTP_FROM);
    console.log("Sending email to:", to);

    const transporter = createTransporter();
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });
    
    console.log("Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("[sendEmail error]", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Error response:", error?.response);
    console.error("Error responseCode:", error?.responseCode);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

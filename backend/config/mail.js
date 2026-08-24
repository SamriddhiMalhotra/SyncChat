import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("MAILER FILE LOADED");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

console.log("EMAIL:", process.env.EMAIL ? "EMAIL EXISTS" : "EMAIL MISSING");
console.log("PASS:", process.env.PASS ? "PASS EXISTS" : "PASS MISSING");

transporter.verify()
  .then(() => {
    console.log("Gmail SMTP connection successful");
  })
  .catch((error) => {
    console.error("Gmail SMTP connection failed:", error);
  });

export const sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: `"Samriddhi Malhotra" <${process.env.EMAIL}>`,
    to,
    subject: "SyncChat - Email Verification OTP",
    html: `
      <h3>SyncChat Email Verification</h3>
      <p>Your OTP is <b>${otp}</b>.</p>
      <p>This OTP expires in 5 minutes.</p>
    `,
  });
};
}

//Your code creates a secure Gmail connection using Nodemailer, then defines a reusable function that takes a user's email and OTP and sends them a password-reset email.

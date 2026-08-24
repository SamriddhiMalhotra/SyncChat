import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

transporter
  .verify()
  .then(() => console.log("Gmail SMTP connection successful"))
  .catch((error) =>
    console.error("Gmail SMTP connection failed:", error)
  );

export const sendOtpMail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"SyncChat" <${process.env.EMAIL}>`,
      to: to,
      subject: "SyncChat - Email Verification OTP",
      html: `
        <h3>SyncChat Email Verification</h3>
        <p>Your OTP is <b>${otp}</b>.</p>
        <p>This OTP expires in 5 minutes.</p>
      `,
    });

    console.log("OTP email sent successfully:", info.messageId);

    return info;
  } catch (error) {
    console.error("SEND OTP EMAIL ERROR:", error);
    throw error;
  }
};
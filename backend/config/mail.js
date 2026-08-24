import nodemailer from 'nodemailer'
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

transporter.verify()
  .then(() => console.log("Gmail SMTP connection successful"))
  .catch((error) => console.error("Gmail SMTP connection failed:", error));

export const sendOtpMail=async  (to,otp)=>{
   await transporter.sendMail({
    from:`"Samriddhi Malhotra" <${process.env.EMAIL}>`,
    to,
    subject:"SyncChat - Email Verification OTP",
    html:`
    <h3>SyncChat Email Verification</h3>
    <p>Your OTP is <b>${otp}</b>.</p>
    <p>This OTP expires in 5 minutes.</p>
  `
   })
}

//Your code creates a secure Gmail connection using Nodemailer, then defines a reusable function that takes a user's email and OTP and sends them a password-reset email.

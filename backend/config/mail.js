import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpMail = async (to, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "SyncChat <onboarding@resend.dev>",
      to: [to],
      subject: "SyncChat - Email Verification OTP",
      html: `
        <h3>SyncChat Email Verification</h3>
        <p>Your OTP is <b>${otp}</b>.</p>
        <p>This OTP expires in 5 minutes.</p>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      throw new Error(error.message);
    }

    console.log("OTP email sent successfully:", data);

    return data;
  } catch (error) {
    console.error("SEND OTP EMAIL ERROR:", error);
    throw error;
  }
};
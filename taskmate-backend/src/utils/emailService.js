import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

/* ===============================
   DEBUG (REMOVE LATER)
=============================== */
console.log("EMAIL CHECK:", process.env.EMAIL_USER);

/* ===============================
   TRANSPORTER
=============================== */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ===============================
   SEND EMAIL FUNCTION (FIXED)
=============================== */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    // 🛑 SAFETY CHECK
    if (!to) {
      console.error("❌ EMAIL ERROR: No recipient provided");
      return;
    }

    await transporter.sendMail({
      from: `"TaskMate" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent to:", to);
  } catch (error) {
    console.error("❌ EMAIL ERROR:", error.message);
  }
};

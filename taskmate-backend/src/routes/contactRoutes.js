import express from "express";
import { sendEmail } from "../utils/emailService.js";

const router = express.Router();

/* ===============================
   POST /api/contact
   PUBLIC — No auth required
=============================== */

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    /* ---------- VALIDATION ---------- */

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required (name, email, message).",
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    /* ---------- SEND EMAIL TO ADMIN ---------- */

    const adminEmail = process.env.ADMIN_EMAIL || "sharmakanav53@gmail.com";

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f13; border-radius: 16px; overflow: hidden; border: 1px solid #1e1e2e;">
        <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 32px 24px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">📩 New Contact Message</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Someone reached out via the TaskMate Contact Form</p>
        </div>
        <div style="padding: 32px 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; color: #888; font-size: 13px; border-bottom: 1px solid #1e1e2e; width: 100px;">Name</td>
              <td style="padding: 12px 0; color: #e4e4e7; font-size: 14px; font-weight: 600; border-bottom: 1px solid #1e1e2e;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #888; font-size: 13px; border-bottom: 1px solid #1e1e2e;">Email</td>
              <td style="padding: 12px 0; color: #e4e4e7; font-size: 14px; border-bottom: 1px solid #1e1e2e;">
                <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #888; font-size: 13px; vertical-align: top;">Message</td>
              <td style="padding: 12px 0; color: #e4e4e7; font-size: 14px; line-height: 1.6;">${message}</td>
            </tr>
          </table>
        </div>
        <div style="padding: 16px 24px; background: #0a0a0f; text-align: center;">
          <p style="color: #555; font-size: 12px; margin: 0;">TaskMate Contact System • Auto-generated email</p>
        </div>
      </div>
    `;

    await sendEmail(
      adminEmail,
      `TaskMate Contact — ${name}`,
      htmlContent
    );

    res.json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("CONTACT FORM ERROR:", error);
    res.status(500).json({
      message: "Failed to send message. Please try again later.",
    });
  }
});

export default router;

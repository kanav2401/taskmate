import nodemailer from "nodemailer";

export const sendEmail = async (arg1, subjectArg, htmlArg) => {

  let to, subject, html;

  if (typeof arg1 === "object") {
    to = arg1.to;
    subject = arg1.subject;
    html = arg1.html;
  } else {
    to = arg1;
    subject = subjectArg;
    html = htmlArg;
  }

  try {

    const transporter = nodemailer.createTransport({

      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

    });

    const info = await transporter.sendMail({

      from: `"TaskMate Support" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,

    });

    console.log("✅ Email sent:", info.response);

  } catch (error) {

    console.error("❌ EMAIL ERROR:", error.message);

  }

};

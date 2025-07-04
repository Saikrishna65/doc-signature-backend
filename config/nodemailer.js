import dotenv from "dotenv";
import nodemailer from "nodemailer";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "./emailTemplete.js";

dotenv.config();

// Create a reusable transporter object
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  logger: true,
  debug: true,
});

// Function to send email
export const sendMail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      html,
    };
    // Send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Error verifying Gmail SMTP:", error);
  } else {
    console.log("Gmail SMTP is ready");
  }
});

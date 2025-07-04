import dotenv from "dotenv";
import nodemailer from "nodemailer";

// Load environment variables from .env
dotenv.config();

// Create a transporter using Gmail SMTP settings
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  logger: true, // optional: log to console
  debug: true, // optional: include SMTP traffic in the logs
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error verifying Gmail SMTP:", error);
  } else {
    console.log("Gmail SMTP is ready:", success);

    // Define mail options
    const mailOptions = {
      from: process.env.GMAIL_USER, // sender address
      to: "sai.mangina789@gmail.com", // list of receivers (change this)
      subject: "Test Email using Gmail SMTP", // Subject line
      text: "Hello, this is a test email sent using Gmail SMTP with Nodemailer!", // plain text body
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent successfully:", info.response);
      }
    });
  }
});

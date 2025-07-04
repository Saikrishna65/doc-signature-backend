import express from "express";
import multer from "multer";
import userAuth from "../middleware/userAuth.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const uploadRouter = express.Router();

// Use in-memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"), false);
  },
});

uploadRouter.post(
  "/upload",
  userAuth,
  upload.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      const fileId = uuidv4();
      const filename = `${fileId}.pdf`;
      const filePath = `/tmp/${filename}`;

      // Write buffer to /tmp directory
      fs.writeFileSync(filePath, req.file.buffer);

      // ✅ Generate full URL based on request
      const fullUrl = `${req.protocol}://${req.get("host")}/signed/${filename}`;

      // Respond with the full file URL
      res.json({
        filePath: fullUrl,
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Failed to upload PDF." });
    }
  }
);

export default uploadRouter;

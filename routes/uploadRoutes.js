// backend/routes/uploadRoutes.js
import express from "express";
import multer from "multer";
import userAuth from "../middleware/userAuth.js";

const uploadRouter = express.Router();

// Use in-memory storage (not saved to disk)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"), false);
  },
});

// Inline controller
uploadRouter.post(
  "/upload",
  userAuth,
  upload.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      const base64 = req.file.buffer.toString("base64");
      res.json({
        dataUri: `data:application/pdf;base64,${base64}`,
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Failed to upload and convert PDF." });
    }
  }
);

export default uploadRouter;

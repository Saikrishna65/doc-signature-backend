import multer from "multer";

// Use memory storage so PDFs never hit disk
const storage = multer.memoryStorage();

// Only allow PDF uploads
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF files are allowed"), false);
};

export const upload = multer({ storage, fileFilter });

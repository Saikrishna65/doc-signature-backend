import express from "express";
import userAuth from "../middleware/userAuth.js";
import { handlePdfUpload } from "../controllers/uploadController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const uploadRouter = express.Router();

uploadRouter.post("/upload", userAuth, upload.single("pdf"), handlePdfUpload);

export default uploadRouter;

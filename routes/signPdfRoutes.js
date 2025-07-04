import express from "express";
import fetch from "node-fetch";
import { PDFDocument } from "pdf-lib";

const router = express.Router();

router.post("/", async (req, res) => {
  const { fileUrl, coords } = req.body;

  try {
    const existing = await fetch(fileUrl);
    const existingBytes = await existing.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingBytes);
    const pages = pdfDoc.getPages();

    for (const sig of coords) {
      const { page: pi, x, y, width, height, imageBase64, opacity = 1 } = sig;
      if (!imageBase64 || !imageBase64.startsWith("data:image/")) continue;

      const page = pages[pi];
      const { width: pw, height: ph } = page.getSize();

      const pngBytes = Buffer.from(imageBase64.split(",")[1], "base64");
      const pngImage = await pdfDoc.embedPng(pngBytes);

      const dw = width * pw;
      const dh = height * ph;

      const dx = Math.max(0, Math.min(x * pw, pw - dw));
      const dy = Math.max(0, Math.min(ph - y * ph - dh, ph - dh));

      page.drawImage(pngImage, {
        x: dx,
        y: dy,
        width: dw,
        height: dh,
        opacity: opacity,
      });
    }

    const out = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="signed.pdf"`);
    res.end(Buffer.from(out));
  } catch (err) {
    console.error("PDF signing error:", err);
    res.status(500).json({ error: "Signing failed" });
  }
});

export default router;

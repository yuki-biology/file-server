const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 80;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use(express.static("public"));

app.post("/uploads", upload.array("files"), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }
  res.json({
    message: "Files uploaded successfully",
    files: req.files.map((f) => ({
      originalName: f.originalname,
      savedAs: f.filename,
      size: f.size,
    })),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`File server listening on http://0.0.0.0:${PORT}`);
});

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadsDir = path.join(__dirname, "uploads");
const metaFile = path.join(uploadsDir, "_meta.json");

function readMeta() {
  try {
    return JSON.parse(fs.readFileSync(metaFile, "utf-8"));
  } catch {
    return {};
  }
}

function writeMeta(meta) {
  fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));
}

const upload = multer({ storage });

app.use(express.static("public"));

app.post("/uploads", upload.array("files"), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }
  const meta = readMeta();
  req.files.forEach((f) => { meta[f.filename] = f.originalname; });
  writeMeta(meta);
  res.json({
    message: "Files uploaded successfully",
    files: req.files.map((f) => ({
      originalName: f.originalname,
      savedAs: f.filename,
      size: f.size,
    })),
  });
});

app.get("/files", (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return res.status(500).json({ message: "Unable to list files" });
    const meta = readMeta();
    const fileInfos = files
      .filter((f) => f !== "_meta.json")
      .map((f) => {
        const stat = fs.statSync(path.join(uploadsDir, f));
        return { filename: f, originalName: meta[f] || f, size: stat.size, createdAt: stat.birthtime };
      });
    res.json(fileInfos);
  });
});

app.get("/download/:filename", (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  const meta = readMeta();
  const originalName = meta[req.params.filename] || req.params.filename;
  res.download(filePath, originalName, (err) => {
    if (err) res.status(404).json({ message: "File not found" });
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`File server listening on http://localhost:${PORT}`);
});

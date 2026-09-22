const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { createPool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const pool = createPool();

const uploadsDir = path.join(__dirname, "../../uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// GET /api/files/
router.get("/:projectId", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;

    const [access] = await pool.query(
      "SELECT 1 FROM tasks WHERE project_id = ? AND assignee_id = ? LIMIT 1",
      [projectId, req.user.id]
    );
    if (access.length === 0) {
      return res.status(403).json({ message: "You don't have access to this project's files." });
    }

    const [files] = await pool.query(
      `SELECT f.id, f.name, f.mime_type, u.name AS uploadedBy, f.uploaded_at
       FROM files f
       LEFT JOIN users u ON u.id = f.uploaded_by
       WHERE f.project_id = ?
       ORDER BY f.uploaded_at DESC`,
      [projectId]
    );

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load files." });
  }
});

// POST /api/files
router.post("/:projectId", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file was uploaded." });
    }

    const [result] = await pool.query(
      `INSERT INTO files (name, project_id, stored_filename, mime_type, uploaded_by, size_bytes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.file.originalname, projectId, req.file.filename, req.file.mimetype, req.user.id, req.file.size]
    );

    res.status(201).json({
      id: result.insertId,
      name: req.file.originalname,
      mime_type: req.file.mimetype,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload file." });
  }
});

// GET /api/files/
router.get("/download/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [[file]] = await pool.query("SELECT * FROM files WHERE id = ?", [id]);
    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }

    const filePath = path.join(uploadsDir, file.stored_filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File is missing from storage." });
    }

    res.download(filePath, file.name); 
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to download file." });
  }
});

// DELETE /api/files/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [[file]] = await pool.query("SELECT * FROM files WHERE id = ?", [id]);
    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }

    const filePath = path.join(uploadsDir, file.stored_filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); 
    }

    await pool.query("DELETE FROM files WHERE id = ?", [id]);

    res.json({ message: "File deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete file." });
  }
});

module.exports = router;
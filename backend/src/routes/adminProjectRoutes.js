// backend/src/routes/adminProjectRoutes.js

const express = require("express");
const { createPool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();
const pool = createPool();

// GET /api/admin/projects
router.get("/", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    const [projects] = await pool.query(
      `SELECT p.id, p.name, p.description, p.color,
              p.created_by, u.name AS creator_name,
              p.created_at
       FROM projects p
       LEFT JOIN users u ON p.created_by = u.id
       ORDER BY p.created_at DESC`
    );
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load projects." });
  }
});

// POST /api/admin/projects
router.post("/", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    const { name, description, color } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required." });
    }

    const [result] = await pool.query(
      "INSERT INTO projects (name, description, color, created_by) VALUES (?, ?, ?, ?)",
      [name, description || null, color || "#05620C", req.user.id]
    );

    res.status(201).json({
      message: "Project created successfully.",
      project: { id: result.insertId, name, description, color },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create project." });
  }
});

// DELETE /api/admin/projects/:id
router.delete("/:id", authMiddleware, requireRole("SuperAdmin"), async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM projects WHERE id = ?", [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.json({ message: "Project deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete project." });
  }
});

module.exports = router;
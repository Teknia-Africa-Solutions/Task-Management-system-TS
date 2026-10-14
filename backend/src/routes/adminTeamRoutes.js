// backend/src/routes/adminTeamRoutes.js
// Note: This assumes a `teams` table exists. If not, we'll need to create one.

const express = require("express");
const { createPool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();
const pool = createPool();

// GET /api/admin/teams
router.get("/", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    const [teams] = await pool.query(
      `SELECT t.id, t.name, t.description, t.manager_id,
              u.name AS manager_name,
              t.created_at
       FROM teams t
       LEFT JOIN users u ON t.manager_id = u.id
       ORDER BY t.created_at DESC`
    );
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load teams." });
  }
});

// POST /api/admin/teams
router.post("/", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    const { name, description, manager_id } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Team name is required." });
    }

    const [result] = await pool.query(
      "INSERT INTO teams (name, description, manager_id) VALUES (?, ?, ?)",
      [name, description || null, manager_id || null]
    );

    res.status(201).json({
      message: "Team created successfully.",
      team: { id: result.insertId, name, description, manager_id },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create team." });
  }
});

// DELETE /api/admin/teams/:id
router.delete("/:id", authMiddleware, requireRole("SuperAdmin"), async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM teams WHERE id = ?", [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Team not found." });
    }

    res.json({ message: "Team deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete team." });
  }
});

module.exports = router;
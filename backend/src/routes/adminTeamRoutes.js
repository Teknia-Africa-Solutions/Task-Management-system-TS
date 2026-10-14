// backend/src/routes/adminTeamRoutes.js
// Note: No `teams` table exists. Uses `project_members` as "teams".

const express = require("express");
const { createPool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();
const pool = createPool();

// GET /api/admin/teams — Returns project teams (users grouped by project)
router.get("/", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id AS project_id, p.name AS project_name, p.color,
              u.id AS user_id, u.name AS user_name, u.email,
              u.role, pm.joined_at
       FROM project_members pm
       JOIN projects p ON pm.project_id = p.id
       JOIN users u ON pm.user_id = u.id
       ORDER BY p.name, u.name`
    );

    // Group users by project
    const teams = rows.reduce((acc, row) => {
      const existing = acc.find((t) => t.project_id === row.project_id);
      if (existing) {
        existing.members.push({
          id: row.user_id,
          name: row.user_name,
          email: row.email,
          role: row.role,
          joined_at: row.joined_at,
        });
      } else {
        acc.push({
          project_id: row.project_id,
          project_name: row.project_name,
          color: row.color,
          members: [
            {
              id: row.user_id,
              name: row.user_name,
              email: row.email,
              role: row.role,
              joined_at: row.joined_at,
            },
          ],
        });
      }
      return acc;
    }, []);

    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load teams." });
  }
});

// POST /api/admin/teams/:projectId/members — Add a member to a project
router.post("/:projectId/members", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    const { userId } = req.body;
    const { projectId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    await pool.query(
      "INSERT IGNORE INTO project_members (project_id, user_id) VALUES (?, ?)",
      [projectId, userId]
    );

    res.json({ message: "Member added to project." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add member." });
  }
});

// DELETE /api/admin/teams/:projectId/members/:userId — Remove a member
router.delete("/:projectId/members/:userId", authMiddleware, requireRole("SuperAdmin"), async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const [result] = await pool.query(
      "DELETE FROM project_members WHERE project_id = ? AND user_id = ?",
      [projectId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Membership not found." });
    }

    res.json({ message: "Member removed from project." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove member." });
  }
});

module.exports = router;
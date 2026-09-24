const express = require("express");
const { createPool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const pool = createPool();

// GET /api/projects — projects the logged-in user has at least one task in,
router.get("/", authMiddleware, async (req, res) => {
  try {
    const [projects] = await pool.query(
      `SELECT
         p.id,
         p.name,
         p.color,
         COUNT(t.id) AS tasksTotal,
         SUM(CASE WHEN t.status = 'Done' THEN 1 ELSE 0 END) AS tasksDone
       FROM projects p
       JOIN tasks t ON t.project_id = p.id
       WHERE p.id IN (
         SELECT DISTINCT project_id FROM tasks WHERE assignee_id = ?
       )
       GROUP BY p.id, p.name, p.color`,
      [req.user.id]
    );

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load projects." });
  }
});
// GET /api/projects/:id — full task list for one specific project
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Confirm the requester actually has at least one task in this project
    const [access] = await pool.query(
      "SELECT 1 FROM tasks WHERE project_id = ? AND assignee_id = ? LIMIT 1",
      [id, req.user.id]
    );
    if (access.length === 0) {
      return res.status(403).json({ message: "You don't have access to this project." });
    }

    const [[project]] = await pool.query("SELECT id, name, color FROM projects WHERE id = ?", [id]);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const [tasks] = await pool.query(
      `SELECT t.id, t.title, t.status, t.priority, t.due_date, u.name AS assigneeName
       FROM tasks t
       LEFT JOIN users u ON u.id = t.assignee_id
       WHERE t.project_id = ?
       ORDER BY t.due_date ASC`,
      [id]
    );

    res.json({ project, tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load project." });
  }
});

module.exports = router;
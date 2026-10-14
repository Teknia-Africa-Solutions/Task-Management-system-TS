// backend/src/routes/adminReportRoutes.js

const express = require("express");
const { createPool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();
const pool = createPool();

// GET /api/admin/reports/summary — KPI stats for dashboard + reports
router.get("/summary", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    const [totalUsers] = await pool.query("SELECT COUNT(*) AS count FROM users");
    const [totalProjects] = await pool.query("SELECT COUNT(*) AS count FROM projects");
    const [totalTasks] = await pool.query("SELECT COUNT(*) AS count FROM tasks");
    const [completedTasks] = await pool.query(
      "SELECT COUNT(*) AS count FROM tasks WHERE status = 'Done'"
    );
    const [overdueTasks] = await pool.query(
      "SELECT COUNT(*) AS count FROM tasks WHERE due_date < CURDATE() AND status != 'Done'"
    );

    res.json({
      totalUsers: totalUsers[0].count,
      totalProjects: totalProjects[0].count,
      totalTasks: totalTasks[0].count,
      completedTasks: completedTasks[0].count,
      overdueTasks: overdueTasks[0].count,
      completionRate:
        totalTasks[0].count > 0
          ? Math.round((completedTasks[0].count / totalTasks[0].count) * 100)
          : 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load summary." });
  }
});

// GET /api/admin/reports/task-status — Task counts by status
router.get("/task-status", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT status, COUNT(*) AS count FROM tasks GROUP BY status`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load task status." });
  }
});

module.exports = router;
const express = require("express");
const { createPool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();
const pool = createPool();

// GET /api/reports/summary — Member's own personal report
router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const [[personal]] = await pool.query(
      `SELECT COUNT(*) AS total, SUM(status = 'Done') AS done
       FROM tasks WHERE assignee_id = ?`,
      [userId]
    );
    const completionRate = personal.total > 0
      ? Math.round((personal.done / personal.total) * 100)
      : 0;

    const [[duration]] = await pool.query(
      `SELECT AVG(DATEDIFF(completed_at, created_at)) AS avgDays
       FROM tasks
       WHERE assignee_id = ? AND status = 'Done' AND completed_at IS NOT NULL`,
      [userId]
    );
    const avgTaskDuration = duration.avgDays !== null
      ? `${Number(duration.avgDays).toFixed(1)}d`
      : "N/A";

    const [[team]] = await pool.query(
      `SELECT COUNT(*) AS total, SUM(status = 'Done') AS done
       FROM tasks
       WHERE project_id IN (
         SELECT DISTINCT project_id FROM tasks WHERE assignee_id = ?
       )`,
      [userId]
    );
    const teamProductivity = team.total > 0
      ? Math.round((team.done / team.total) * 100)
      : 0;

    const [createdByWeek] = await pool.query(
      `SELECT YEARWEEK(created_at) AS weekKey, COUNT(*) AS count
       FROM tasks
       WHERE assignee_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 8 WEEK)
       GROUP BY weekKey`,
      [userId]
    );

    const [completedByWeek] = await pool.query(
      `SELECT YEARWEEK(completed_at) AS weekKey, COUNT(*) AS count
       FROM tasks
       WHERE assignee_id = ? AND completed_at IS NOT NULL AND completed_at >= DATE_SUB(NOW(), INTERVAL 8 WEEK)
       GROUP BY weekKey`,
      [userId]
    );

    const weekKeys = new Set([
      ...createdByWeek.map((r) => r.weekKey),
      ...completedByWeek.map((r) => r.weekKey),
    ]);

    const weeklyTrend = Array.from(weekKeys)
      .sort()
      .map((weekKey) => ({
        week: `Wk ${String(weekKey).slice(-2)}`,
        created: createdByWeek.find((r) => r.weekKey === weekKey)?.count || 0,
        completed: completedByWeek.find((r) => r.weekKey === weekKey)?.count || 0,
      }));

    res.json({ completionRate, avgTaskDuration, teamProductivity, weeklyTrend });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load report data." });
  }
});

// GET /api/reports/superadmin/summary — org-wide, SuperAdmin only
router.get("/superadmin/summary", authMiddleware, requireRole("SuperAdmin"), async (req, res) => {
  try {
    const [[completion]] = await pool.query(
      `SELECT COUNT(*) AS total, SUM(status = 'Done') AS done FROM tasks`
    );
    const completionRate = completion.total > 0
      ? Math.round((completion.done / completion.total) * 100)
      : 0;

    const [[duration]] = await pool.query(
      `SELECT AVG(DATEDIFF(completed_at, created_at)) AS avgDays
       FROM tasks
       WHERE status = 'Done' AND completed_at IS NOT NULL`
    );
    const avgTaskDuration = duration.avgDays !== null
      ? `${Number(duration.avgDays).toFixed(1)}d`
      : "N/A";

    const [[onTime]] = await pool.query(
      `SELECT
         COUNT(*) AS totalCompleted,
         SUM(due_date IS NULL OR completed_at <= due_date) AS onTimeCount
       FROM tasks
       WHERE status = 'Done' AND completed_at IS NOT NULL`
    );
    const onTimeRate = onTime.totalCompleted > 0
      ? Math.round((onTime.onTimeCount / onTime.totalCompleted) * 100)
      : 0;

    const [createdByWeek] = await pool.query(
      `SELECT YEARWEEK(created_at) AS weekKey, COUNT(*) AS count
       FROM tasks
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 8 WEEK)
       GROUP BY weekKey`
    );

    const [completedByWeek] = await pool.query(
      `SELECT YEARWEEK(completed_at) AS weekKey, COUNT(*) AS count
       FROM tasks
       WHERE completed_at IS NOT NULL AND completed_at >= DATE_SUB(NOW(), INTERVAL 8 WEEK)
       GROUP BY weekKey`
    );

    const weekKeys = new Set([
      ...createdByWeek.map((r) => r.weekKey),
      ...completedByWeek.map((r) => r.weekKey),
    ]);

    const weeklyTrend = Array.from(weekKeys)
      .sort()
      .map((weekKey) => ({
        week: `Wk ${String(weekKey).slice(-2)}`,
        created: createdByWeek.find((r) => r.weekKey === weekKey)?.count || 0,
        completed: completedByWeek.find((r) => r.weekKey === weekKey)?.count || 0,
      }));

    res.json({ completionRate, avgTaskDuration, onTimeRate, weeklyTrend });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load report data." });
  }
});

module.exports = router;
const express = require("express");
const { createPool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const pool = createPool();

router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Personal completion rate
    const [[personal]] = await pool.query(
      `SELECT COUNT(*) AS total, SUM(status = 'Done') AS done
       FROM tasks WHERE assignee_id = ?`,
      [userId]
    );
    const completionRate = personal.total > 0
      ? Math.round((personal.done / personal.total) * 100)
      : 0;

    // 2. Average task duration, in days, for tasks you've actually completed
    const [[duration]] = await pool.query(
      `SELECT AVG(DATEDIFF(completed_at, created_at)) AS avgDays
       FROM tasks
       WHERE assignee_id = ? AND status = 'Done' AND completed_at IS NOT NULL`,
      [userId]
    );
    const avgTaskDuration = duration.avgDays !== null
      ? `${Number(duration.avgDays).toFixed(1)}d`
      : "N/A";

    // 3. Team productivity — across every project you're part of, ALL assignees' tasks
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

    // 4. Weekly trend — tasks created vs completed, per week, over the last 8 weeks
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

    // Merge both into one array, one entry per week, defaulting missing weeks to 0
    const weekKeys = new Set([
      ...createdByWeek.map((r) => r.weekKey),
      ...completedByWeek.map((r) => r.weekKey),
    ]);

    const weeklyTrend = Array.from(weekKeys)
      .sort()
      .map((weekKey) => ({
        week: `Wk ${String(weekKey).slice(-2)}`, // last 2 digits of YEARWEEK as a short label
        created: createdByWeek.find((r) => r.weekKey === weekKey)?.count || 0,
        completed: completedByWeek.find((r) => r.weekKey === weekKey)?.count || 0,
      }));

    res.json({
      completionRate,
      avgTaskDuration,
      teamProductivity,
      weeklyTrend,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load report data." });
  }
});

module.exports = router;
const express = require("express");
const { createPool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();
const pool = createPool();

router.get("/superadmin/summary", authMiddleware, requireRole("SuperAdmin"), async (req, res) => {
  try {
    const [[userCounts]] = await pool.query(
      `SELECT
         COUNT(*) AS total,
         SUM(role = 'Member') AS members,
         SUM(role = 'Admin') AS admins,
         SUM(role = 'SuperAdmin') AS superAdmins
       FROM users`
    );

    const [[projectCount]] = await pool.query("SELECT COUNT(*) AS total FROM projects");

    const [[taskCounts]] = await pool.query(
      `SELECT COUNT(*) AS total, SUM(status = 'Done') AS done
       FROM tasks`
    );

    const [recentUsers] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5"
    );

    res.json({
      users: {
        total: userCounts.total,
        members: userCounts.members,
        admins: userCounts.admins,
        superAdmins: userCounts.superAdmins,
      },
      projects: { total: projectCount.total },
      tasks: {
        total: taskCounts.total,
        done: taskCounts.done,
      },
      recentUsers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load dashboard summary." });
  }
});

module.exports = router;
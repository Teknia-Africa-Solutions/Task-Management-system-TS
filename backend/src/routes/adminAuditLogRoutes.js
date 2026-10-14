// backend/src/routes/adminAuditLogRoutes.js
// Note: No `audit_logs` table exists. Uses `task_activity` as audit trail.

const express = require("express");
const { createPool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();
const pool = createPool();

// GET /api/admin/audit-logs
router.get("/", authMiddleware, requireRole("SuperAdmin"), async (req, res) => {
  try {
    const [logs] = await pool.query(
      `SELECT ta.id, ta.action, ta.description,
              ta.created_at,
              u.name AS user_name,
              t.title AS task_title
       FROM task_activity ta
       LEFT JOIN users u ON ta.user_id = u.id
       LEFT JOIN tasks t ON ta.task_id = t.id
       ORDER BY ta.created_at DESC
       LIMIT 200`
    );
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load audit logs." });
  }
});

module.exports = router;
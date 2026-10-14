// backend/src/routes/adminAuditLogRoutes.js
// Note: Requires an `audit_logs` table. If it doesn't exist, we'll create one.

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
      `SELECT al.id, al.action, al.resource, al.description, al.status,
              DATE_FORMAT(al.created_at, '%Y-%m-%d') AS date,
              DATE_FORMAT(al.created_at, '%H:%i:%s') AS time,
              u.name AS user_name
       FROM audit_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.created_at DESC
       LIMIT 200`
    );
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load audit logs." });
  }
});

module.exports = router;
// backend/src/routes/adminNotificationRoutes.js

const express = require("express");
const { createPool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();
const pool = createPool();

// GET /api/admin/notifications
router.get("/", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    const [notifications] = await pool.query(
      `SELECT n.id, n.type, n.title, n.message,
              n.related_task_id, n.related_project_id,
              n.is_read, n.created_at,
              u.name AS user_name
       FROM notifications n
       LEFT JOIN users u ON n.user_id = u.id
       ORDER BY n.created_at DESC
       LIMIT 200`
    );
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load notifications." });
  }
});

// PATCH /api/admin/notifications/:id/read
router.patch("/:id/read", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE notifications SET is_read = TRUE WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.json({ message: "Notification marked as read." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to mark notification as read." });
  }
});

// PATCH /api/admin/notifications/read-all
router.patch("/read-all", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    await pool.query("UPDATE notifications SET is_read = TRUE");
    res.json({ message: "All notifications marked as read." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to mark all as read." });
  }
});

// DELETE /api/admin/notifications/:id
router.delete("/:id", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM notifications WHERE id = ?", [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.json({ message: "Notification deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete notification." });
  }
});

module.exports = router;
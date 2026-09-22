const express = require("express");
const { createPool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const pool = createPool();

// GET /api/notifications —
router.get("/", authMiddleware, async (req, res) => {
  try {
    const [notifications] = await pool.query(
      `SELECT id, type, title, is_read, created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load notifications." });
  }
});

// PATCH /api/notifications
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.json({ message: "Marked as read." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update notification." });
  }
});

// PATCH /api/notifications/read-all 
router.patch("/read-all/mark", authMiddleware, async (req, res) => {
  try {
    await pool.query(
      "UPDATE notifications SET is_read = TRUE WHERE user_id = ?",
      [req.user.id]
    );

    res.json({ message: "All notifications marked as read." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update notifications." });
  }
});

module.exports = router;
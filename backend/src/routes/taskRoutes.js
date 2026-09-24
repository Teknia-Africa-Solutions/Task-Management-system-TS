const express = require("express");
const { createPool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const pool = createPool();

// GET /api/tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const [tasks] = await pool.query(
      `SELECT id, title, description, category, priority, status,
              DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date,
              project_id
       FROM tasks
       WHERE assignee_id = ?
       ORDER BY due_date ASC`,
      [req.user.id]
    );

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load tasks." });
  }
});
// PATCH /api/tasks/
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, description } = req.body;

    const validStatuses = ["Todo", "In Progress", "Review", "Done"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const fieldsToUpdate = [];
    const values = [];

    if (status !== undefined) {
      fieldsToUpdate.push("status = ?");
      values.push(status);

      // Automatically stamp completed_at when marked Done, clear it otherwise
      fieldsToUpdate.push("completed_at = ?");
      values.push(status === "Done" ? new Date() : null);
    }
    if (description !== undefined) {
      fieldsToUpdate.push("description = ?");
      values.push(description);
    }

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: "Nothing to update." });
    }

    values.push(id, req.user.id);

    const [result] = await pool.query(
      `UPDATE tasks SET ${fieldsToUpdate.join(", ")} WHERE id = ? AND assignee_id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found or not assigned to you." });
    }

    res.json({ message: "Task updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update task." });
  }
});

module.exports = router;
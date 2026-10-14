// backend/src/routes/adminTaskRoutes.js

const express = require("express");
const { createPool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();
const pool = createPool();

// GET /api/admin/tasks — all tasks (not just my tasks)
router.get("/", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    const [tasks] = await pool.query(
      `SELECT t.id, t.title, t.description, t.category, t.priority, t.status,
              DATE_FORMAT(t.due_date, '%Y-%m-%d') AS due_date,
              t.project_id, p.name AS project_name,
              t.assignee_id, u.name AS assignee_name,
              t.created_at
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN users u ON t.assignee_id = u.id
       ORDER BY t.due_date ASC`
    );
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load tasks." });
  }
});

// POST /api/admin/tasks
router.post("/", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    const { title, description, priority, status, project_id, assignee_id, due_date, category } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required." });
    }

    const [result] = await pool.query(
      `INSERT INTO tasks (title, description, priority, status, project_id, assignee_id, due_date, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        priority || "Medium",
        status || "Todo",
        project_id || null,
        assignee_id || null,
        due_date || null,
        category || null,
      ]
    );

    res.status(201).json({
      message: "Task created successfully.",
      task: { id: result.insertId, title, priority, status, project_id, assignee_id },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create task." });
  }
});

// PATCH /api/admin/tasks/:id/status
router.patch("/:id/status", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Todo", "In Progress", "Review", "Done"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const completedAt = status === "Done" ? new Date() : null;

    const [result] = await pool.query(
      "UPDATE tasks SET status = ?, completed_at = ? WHERE id = ?",
      [status, completedAt, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.json({ message: "Task status updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update task." });
  }
});

// PATCH /api/admin/tasks/:id/priority
router.patch("/:id/priority", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    const { priority } = req.body;
    const validPriorities = ["Low", "Medium", "High", "Critical"];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority." });
    }

    const [result] = await pool.query(
      "UPDATE tasks SET priority = ? WHERE id = ?",
      [priority, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.json({ message: "Task priority updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update priority." });
  }
});

// DELETE /api/admin/tasks/:id
router.delete("/:id", authMiddleware, requireRole("SuperAdmin"), async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.json({ message: "Task deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete task." });
  }
});

module.exports = router;
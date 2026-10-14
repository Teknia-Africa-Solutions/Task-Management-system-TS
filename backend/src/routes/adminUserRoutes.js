// backend/src/routes/adminUserRoutes.js

const express = require("express");
const bcrypt = require("bcryptjs");
const { createPool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();
const pool = createPool();

// GET /api/admin/users — List all users
router.get("/", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load users." });
  }
});

// POST /api/admin/users — Add new user
router.post("/", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || "Member";

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, userRole]
    );

    res.status(201).json({
      message: "User created successfully.",
      user: { id: result.insertId, name, email, role: userRole },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user." });
  }
});

// PATCH /api/admin/users/:id/status — Toggle active/inactive (uses role or a status field)
router.patch("/:id/status", authMiddleware, requireRole("SuperAdmin", "Admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // If your DB has no `status` column, we'll use role-based logic
    // For now, assume there's a status column. If not, remove this route.
    const [result] = await pool.query("UPDATE users SET status = ? WHERE id = ?", [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User status updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user status." });
  }
});

// PATCH /api/admin/users/:id/role — Change user role
router.patch("/:id/role", authMiddleware, requireRole("SuperAdmin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["Member", "Admin", "SuperAdmin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const [result] = await pool.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "Role updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update role." });
  }
});

// DELETE /api/admin/users/:id — Delete user
router.delete("/:id", authMiddleware, requireRole("SuperAdmin"), async (req, res) => {
  try {
    const { id } = req.params;

    if (Number(id) === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }

    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user." });
  }
});

module.exports = router;
const express = require("express");
const { createPool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const bcrypt = require("bcryptjs");

const router = express.Router();
const pool = createPool();

router.get("/", authMiddleware, requireRole("SuperAdmin"), async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load users." });
  }
});

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

// POST /api/users — create a new account directly (SuperAdmin only)
router.post("/", authMiddleware, requireRole("SuperAdmin"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const validRoles = ["Member", "Admin", "SuperAdmin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user." });
  }
});
// PATCH /api/users/:id/status — activate or deactivate an account (SuperAdmin only)
router.patch("/:id/status", authMiddleware, requireRole("SuperAdmin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be true or false." });
    }

    const [result] = await pool.query(
      "UPDATE users SET is_active = ? WHERE id = ?",
      [isActive, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: isActive ? "User reactivated." : "User deactivated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user status." });
  }
});

module.exports = router;
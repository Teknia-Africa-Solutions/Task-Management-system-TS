const express = require("express");
const { createPool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();
const pool = createPool();

// GET /api/settings — SuperAdmin only
router.get("/", authMiddleware, requireRole("SuperAdmin"), async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT `key`, `value` FROM settings");
    // Turn the array of {key, value} rows into a single flat object, e.g. { default_signup_role: "Member" }
    const settings = rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load settings." });
  }
});

// PATCH /api/settings/:key — update one setting, SuperAdmin only
router.patch("/:key", authMiddleware, requireRole("SuperAdmin"), async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (!value) {
      return res.status(400).json({ message: "A value is required." });
    }

    const [result] = await pool.query(
      "UPDATE settings SET `value` = ? WHERE `key` = ?",
      [value, key]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Setting not found." });
    }

    res.json({ message: "Setting updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update setting." });
  }
});

module.exports = router;
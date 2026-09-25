const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createPool } = require("../config/db");


const router = express.Router();
const pool = createPool();

console.log("DB_USER at authRoutes load:", process.env.DB_USER);
console.log("DB_NAME at authRoutes load:", process.env.DB_NAME);
console.log("Pool created?", pool !== null);

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

const [[setting]] = await pool.query(
  "SELECT `value` FROM settings WHERE `key` = 'default_signup_role'"
);
const defaultRole = setting?.value || "Member";

await pool.query(
  "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
  [name, email, hashedPassword, defaultRole]
);

    res.status(201).json({ message: "Account created successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});



router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
const user = rows[0];

if (!user) {
  return res.status(401).json({ message: "Invalid email or password." });
}

if (!user.is_active) {
  return res.status(403).json({ message: "This account has been deactivated." });
}

const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

module.exports = router;
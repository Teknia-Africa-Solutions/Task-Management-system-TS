const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const { createPool } = require("./src/config/db");

const app = express();
const PORT = process.env.PORT || 3000;
const pool = createPool();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "task-management-api" });
});

app.get("/api/db-health", async (_req, res) => {
  if (!pool) {
    return res.status(503).json({
      ok: false,
      message: "Database is not configured. Set DB_USER and DB_NAME in .env.",
    });
  }

  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, database: process.env.DB_NAME });
  } catch (error) {
    res.status(503).json({ ok: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

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

// ---------- Auth Routes ----------
const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

// ---------- Admin Routes ----------
const adminUserRoutes = require("./src/routes/adminUserRoutes");
app.use("/api/admin/users", adminUserRoutes);

const adminTeamRoutes = require("./src/routes/adminTeamRoutes");
app.use("/api/admin/teams", adminTeamRoutes);

const adminProjectRoutes = require("./src/routes/adminProjectRoutes");
app.use("/api/admin/projects", adminProjectRoutes);

const adminTaskRoutes = require("./src/routes/adminTaskRoutes");
app.use("/api/admin/tasks", adminTaskRoutes);

const adminNotificationRoutes = require("./src/routes/adminNotificationRoutes");
app.use("/api/admin/notifications", adminNotificationRoutes);

const adminReportRoutes = require("./src/routes/adminReportRoutes");
app.use("/api/admin/reports", adminReportRoutes);

const adminAuditLogRoutes = require("./src/routes/adminAuditLogRoutes");
app.use("/api/admin/audit-logs", adminAuditLogRoutes);

// ---------- Health Checks ----------
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

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
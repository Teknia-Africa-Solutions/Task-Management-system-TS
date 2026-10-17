const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { createPool } = require("./src/config/db");

const app = express();
const PORT = process.env.PORT || 3000;
const pool = createPool();

app.use(cors());
app.use(express.json());


const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

const taskRoutes = require("./src/routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

const projectRoutes = require("./src/routes/projectRoutes");
app.use("/api/projects", projectRoutes);

const notificationRoutes = require("./src/routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);

const messageRoutes = require("./src/routes/messageRoutes");
app.use("/api/conversations", messageRoutes);

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173" },
});

const onlineUsers = new Map(); 

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("No token provided"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  onlineUsers.set(socket.userId, socket.id);
  console.log(`User ${socket.userId} connected`);

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.userId);
    console.log(`User ${socket.userId} disconnected`);
  });
});

app.set("io", io);
app.set("onlineUsers", onlineUsers);

const fileRoutes = require("./src/routes/fileRoutes");
app.use("/api/files", fileRoutes);

const reportRoutes = require("./src/routes/reportRoutes");
app.use("/api/reports", reportRoutes);

//SuperAdmin
const userRoutes = require("./src/routes/userRoutes");
app.use("/api/users", userRoutes);


const dashboardRoutes = require("./src/routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

const settingsRoutes = require("./src/routes/settingsRoutes");
app.use("/api/settings", settingsRoutes);

httpServer.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
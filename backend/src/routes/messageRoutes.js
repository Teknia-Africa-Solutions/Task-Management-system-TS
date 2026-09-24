const express = require("express");
const { createPool } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const pool = createPool();

// GET /api/conversations 
router.get("/", authMiddleware, async (req, res) => {
  try {
    const [conversations] = await pool.query(
      `SELECT
         c.id,
         other.id AS otherUserId,
         other.name AS otherUserName,
         (SELECT text FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS lastMessage,
         (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS lastMessageTime
       FROM conversations c
       JOIN conversation_participants me ON me.conversation_id = c.id AND me.user_id = ?
       JOIN conversation_participants otherP ON otherP.conversation_id = c.id AND otherP.user_id != ?
       JOIN users other ON other.id = otherP.user_id
       ORDER BY lastMessageTime DESC`,
      [req.user.id, req.user.id]
    );

    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load conversations." });
  }
});

// GET /api/conversations/
router.get("/:id/messages", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [access] = await pool.query(
      "SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ?",
      [id, req.user.id]
    );
    if (access.length === 0) {
      return res.status(403).json({ message: "You don't have access to this conversation." });
    }

    const [messages] = await pool.query(
      `SELECT id, sender_id, text, created_at
       FROM messages
       WHERE conversation_id = ?
       ORDER BY created_at ASC`,
      [id]
    );

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load messages." });
  }
});

// POST /api/conversations
router.post("/:id/messages", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required." });
    }

    const [access] = await pool.query(
      "SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ?",
      [id, req.user.id]
    );
    if (access.length === 0) {
      return res.status(403).json({ message: "You don't have access to this conversation." });
    }

    const [result] = await pool.query(
      "INSERT INTO messages (conversation_id, sender_id, text) VALUES (?, ?, ?)",
      [id, req.user.id, text]
    );

    const newMessage = {
      id: result.insertId,
      conversation_id: Number(id),
      sender_id: req.user.id,
      text,
      created_at: new Date().toISOString(),
    };

    const [participants] = await pool.query(
      "SELECT user_id FROM conversation_participants WHERE conversation_id = ? AND user_id != ?",
      [id, req.user.id]
    );

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    participants.forEach((p) => {
      const socketId = onlineUsers.get(p.user_id);
      if (socketId) {
        io.to(socketId).emit("newMessage", newMessage);
      }
    });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message." });
  }
});

module.exports = router;
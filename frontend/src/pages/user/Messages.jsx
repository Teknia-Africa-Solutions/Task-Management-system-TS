import { useState, useEffect, useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import { getConversations, getMessages, sendMessage } from "../../services/messageService";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Messages() {
  const { user } = useAuth();
  const socket = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeConvoId, setActiveConvoId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showThreadOnMobile, setShowThreadOnMobile] = useState(false);

  const activeConvo = conversations.find((c) => c.id === activeConvoId);

  // Load the conversation list once, on mount
  useEffect(() => {
    async function loadConversations() {
      try {
        const data = await getConversations();
        setConversations(data);
        if (data.length > 0) setActiveConvoId(data[0].id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadConversations();
  }, []);

  // Load messages whenever the active conversation changes
  useEffect(() => {
    if (!activeConvoId) return;
    async function loadMessages() {
      try {
        const data = await getMessages(activeConvoId);
        setMessages(data);
      } catch (err) {
        setError(err.message);
      }
    }
    loadMessages();
  }, [activeConvoId]);

  // Listen for real-time incoming messages
  useEffect(() => {
    if (!socket) return;

    function handleNewMessage(message) {
      if (message.conversation_id === activeConvoId) {
        setMessages((prev) => [...prev, message]);
      }
      // Update the conversation list preview regardless of which one is open
      setConversations((prev) =>
        prev.map((c) =>
          c.id === message.conversation_id
            ? { ...c, lastMessage: message.text, lastMessageTime: message.created_at }
            : c
        )
      );
    }

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, activeConvoId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!draft.trim() || !activeConvoId) return;

    try {
      const sentMessage = await sendMessage(activeConvoId, draft);
      setMessages((prev) => [...prev, sentMessage]);
      setDraft("");
    } catch (err) {
      setError(err.message);
    }
  };

  const openConversation = (id) => {
    setActiveConvoId(id);
    setShowThreadOnMobile(true);
  };

  if (loading) {
    return <p className="text-sm text-[#6B7280]">Loading conversations...</p>;
  }

  if (conversations.length === 0) {
    return <p className="text-sm text-[#6B7280] text-center py-10">No conversations yet.</p>;
  }

  return (
    <div className="bg-white border border-black/5 rounded-xl shadow-sm h-[75vh] flex overflow-hidden">
      <div
        className={`w-full lg:w-80 border-r border-black/5 flex-col overflow-y-auto ${
          showThreadOnMobile ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="px-5 py-4 border-b border-black/5">
          <h2 className="font-semibold text-[#1F2937]">Messages</h2>
        </div>
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => openConversation(c.id)}
            className={`w-full flex items-center gap-3 px-5 py-3 text-left border-b border-black/5 hover:bg-black/[0.02] transition ${
              c.id === activeConvoId ? "bg-[#F8FAF8]" : ""
            }`}
          >
            <div className="w-11 h-11 rounded-full bg-[#05620C] text-white flex items-center justify-center text-sm font-semibold shrink-0">
              {c.otherUserName?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#1F2937] truncate">{c.otherUserName}</p>
              <p className="text-xs text-[#6B7280] truncate">{c.lastMessage || "No messages yet"}</p>
            </div>
          </button>
        ))}
      </div>

      <div className={`flex-1 flex-col ${showThreadOnMobile ? "flex" : "hidden lg:flex"}`}>
        {activeConvo && (
          <>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5">
              <button
                onClick={() => setShowThreadOnMobile(false)}
                className="lg:hidden text-[#6B7280] text-sm mr-1"
              >
                ← Back
              </button>
              <div className="w-10 h-10 rounded-full bg-[#05620C] text-white flex items-center justify-center text-sm font-semibold">
                {activeConvo.otherUserName?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <p className="text-sm font-semibold text-[#1F2937]">{activeConvo.otherUserName}</p>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender_id === user.id ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                      m.sender_id === user.id ? "bg-[#05620C] text-white" : "bg-black/5 text-[#1F2937]"
                    }`}
                  >
                    <p>{m.text}</p>
                    <p className={`text-[10px] mt-1 ${m.sender_id === user.id ? "text-white/70" : "text-[#6B7280]"}`}>
                      {formatTime(m.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 px-5 py-3 border-t border-black/5">
              <button type="button" className="p-2 text-[#6B7280] hover:text-[#1F2937]">
                <Paperclip size={18} />
              </button>
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 text-sm bg-black/5 rounded-full focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
              />
              <button
                type="submit"
                className="w-9 h-9 flex items-center justify-center rounded-full text-white bg-[#05620C] hover:bg-[#034A09] transition"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
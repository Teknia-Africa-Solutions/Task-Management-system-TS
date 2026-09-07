import { useState } from "react";
import { Paperclip, Send } from "lucide-react";

const initialMessages = [
  { id: 1, from: "them", text: "Hey! How's the UI design coming along?", time: "10:30 AM" },
  { id: 2, from: "me", text: "Almost done! Just finishing the dashboard layout.", time: "10:32 AM" },
  { id: 3, from: "them", text: "Great! Can you share the prototype by EOD?", time: "10:35 AM" },
];

export default function Messages() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  const contact = { name: "Jane Doe", status: "Online", initials: "JD" };

  const handleSend = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, from: "me", text: draft, time: "Now" },
    ]);
    setDraft("");
  };

  return (
    <div className="bg-white border border-black/5 rounded-xl shadow-sm flex flex-col h-[70vh]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5">
        <div className="w-10 h-10 rounded-full bg-[#05620C] text-white flex items-center justify-center text-sm font-semibold">
          {contact.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1F2937]">{contact.name}</p>
          <p className="text-xs text-[#05620C]">{contact.status}</p>
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                m.from === "me" ? "bg-[#05620C] text-white" : "bg-black/5 text-[#1F2937]"
              }`}
            >
              <p>{m.text}</p>
              <p className={`text-[10px] mt-1 ${m.from === "me" ? "text-white/70" : "text-[#6B7280]"}`}>
                {m.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
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
    </div>
  );
}
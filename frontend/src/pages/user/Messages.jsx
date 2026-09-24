import { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { conversations } from "../../data/mockData";

export default function Messages() {
  const [activeConvoId, setActiveConvoId] = useState(conversations[0].id);
  const [allConversations, setAllConversations] = useState(conversations);
  const [draft, setDraft] = useState("");
  const [showThreadOnMobile, setShowThreadOnMobile] = useState(false);

  const activeConvo = allConversations.find((c) => c.id === activeConvoId);

  const handleSend = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;

    setAllConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvoId
          ? {
              ...c,
              messages: [...c.messages, { id: c.messages.length + 1, from: "me", text: draft, time: "Now" }],
              lastMessage: draft,
              time: "Now",
            }
          : c
      )
    );
    setDraft("");
  };

  const openConversation = (id) => {
    setActiveConvoId(id);
    setShowThreadOnMobile(true); 
  };

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
        {allConversations.map((c) => (
          <button
            key={c.id}
            onClick={() => openConversation(c.id)}
            className={`w-full flex items-center gap-3 px-5 py-3 text-left border-b border-black/5 hover:bg-black/[0.02] transition ${
              c.id === activeConvoId ? "bg-[#F8FAF8]" : ""
            }`}
          >
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full bg-[#05620C] text-white flex items-center justify-center text-sm font-semibold">
                {c.initials}
              </div>
              {c.status === "Online" && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-[#1F2937] truncate">{c.name}</p>
                <span className="text-[10px] text-[#6B7280] shrink-0">{c.time}</span>
              </div>
              <p className="text-xs text-[#6B7280] truncate">{c.lastMessage}</p>
            </div>
          </button>
        ))}
      </div>

      <div
        className={`flex-1 flex-col ${showThreadOnMobile ? "flex" : "hidden lg:flex"}`}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5">
          <button
            onClick={() => setShowThreadOnMobile(false)}
            className="lg:hidden text-[#6B7280] text-sm mr-1"
          >
            ← Back
          </button>
          <div className="w-10 h-10 rounded-full bg-[#05620C] text-white flex items-center justify-center text-sm font-semibold">
            {activeConvo.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1F2937]">{activeConvo.name}</p>
            <p className="text-xs text-[#05620C]">{activeConvo.status}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {activeConvo.messages.map((m) => (
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
    </div>
  );
}
import { useState } from "react";

const initialPrefs = [
  { id: "taskAssigned", label: "New task assigned to me", enabled: true },
  { id: "taskUpdated", label: "Task status changes", enabled: true },
  { id: "messages", label: "New messages", enabled: true },
  { id: "deadlines", label: "Upcoming deadline reminders", enabled: true },
  { id: "mentions", label: "Someone mentions me", enabled: false },
];

export default function NotificationPreferences() {
  const [prefs, setPrefs] = useState(initialPrefs);

  const toggle = (id) => {
    setPrefs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  return (
    <div className="max-w-lg">
      <div className="bg-white border border-black/5 rounded-xl shadow-sm p-6">
        <h1 className="text-lg font-bold text-[#1F2937] mb-1">Notification Preferences</h1>
        <p className="text-sm text-[#6B7280] mb-6">Choose what you want to be notified about.</p>

        <div className="divide-y divide-black/5">
          {prefs.map((pref) => (
            <div key={pref.id} className="flex items-center justify-between py-3.5">
              <span className="text-sm text-[#1F2937]">{pref.label}</span>
              <button
                onClick={() => toggle(pref.id)}
                className={`w-11 h-6 rounded-full transition relative ${
                  pref.enabled ? "bg-[#05620C]" : "bg-black/10"
                }`}
                aria-label={`Toggle ${pref.label}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    pref.enabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
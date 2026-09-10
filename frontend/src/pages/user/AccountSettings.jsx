import { useState } from "react";

export default function AccountSettings() {
  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("jane@taskflow.io");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg">
      <div className="bg-white border border-black/5 rounded-xl shadow-sm p-6">
        <h1 className="text-lg font-bold text-[#1F2937] mb-6">Account Settings</h1>

        {saved && (
          <div className="mb-5 text-sm text-[#05620C] bg-[#E8F4E9] border border-[#05620C]/20 rounded-md px-3 py-2">
            Changes saved.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1.5">New password</label>
            <input
              type="password"
              placeholder="Leave blank to keep current password"
              className="w-full px-3.5 py-2.5 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg text-white font-medium bg-[#05620C] hover:bg-[#034A09] transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
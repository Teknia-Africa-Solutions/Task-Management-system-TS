import { useState, useEffect } from "react";
import { getSettings, updateSetting } from "../../services/settingsService";

const roleOptions = ["Member", "Admin"]; // deliberately excludes SuperAdmin — see note below

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleRoleChange = async (newRole) => {
    setError("");
    try {
      await updateSetting("default_signup_role", newRole);
      setSettings((prev) => ({ ...prev, default_signup_role: newRole }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p className="text-sm text-[#6B7280]">Loading settings...</p>;
  }

  return (
    <div className="max-w-lg">
      <div className="bg-white border border-black/5 rounded-xl shadow-sm p-6">
        <h1 className="text-lg font-bold text-[#1F2937] mb-1">System Settings</h1>
        <p className="text-sm text-[#6B7280] mb-6">Configure organization-wide defaults.</p>

        {error && (
          <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {saved && (
          <div className="mb-5 text-sm text-[#05620C] bg-[#E8F4E9] border border-[#05620C]/20 rounded-md px-3 py-2">
            Setting saved.
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[#1F2937] mb-1.5">
            Default role for new signups
          </label>
          <p className="text-xs text-[#6B7280] mb-2">
            New accounts registering through the sign-up page will be assigned this role automatically.
          </p>
          <select
            value={settings.default_signup_role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="w-full text-sm border border-black/10 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
          >
            {roleOptions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
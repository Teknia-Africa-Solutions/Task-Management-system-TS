import { useState, useEffect } from "react";
import { getSettings, updateSetting } from "../../services/settingsService";
import { updateMyProfile } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

const roleOptions = ["Member", "Admin"]; // SuperAdmin intentionally excluded — see earlier note

export default function Settings() {
  const { user, login } = useAuth();

  // Account settings state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [savingAccount, setSavingAccount] = useState(false);
  const [accountError, setAccountError] = useState("");
  const [accountSaved, setAccountSaved] = useState(false);

  // System settings state
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [settingsError, setSettingsError] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        setSettingsError(err.message);
      } finally {
        setLoadingSettings(false);
      }
    }
    loadSettings();
  }, []);

  const handleAccountSave = async (e) => {
    e.preventDefault();
    setSavingAccount(true);
    setAccountError("");
    try {
      const updated = await updateMyProfile({
        name,
        email,
        password: password || undefined,
      });
      // Keep AuthContext in sync, so the Sidebar/Topbar reflect the new name/email immediately
      login({ ...user, name: updated.name, email: updated.email }, localStorage.getItem("token"));
      setPassword("");
      setAccountSaved(true);
      setTimeout(() => setAccountSaved(false), 2000);
    } catch (err) {
      setAccountError(err.message);
    } finally {
      setSavingAccount(false);
    }
  };

  const handleSettingChange = async (key, value) => {
    setSettingsError("");
    try {
      await updateSetting(key, value);
      setSettings((prev) => ({ ...prev, [key]: value }));
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
    } catch (err) {
      setSettingsError(err.message);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Account Settings */}
      <div className="bg-white border border-black/5 rounded-xl shadow-sm p-6 h-fit">
        <h1 className="text-lg font-bold text-[#1F2937] mb-1">Account Settings</h1>
        <p className="text-sm text-[#6B7280] mb-6">Update your own name, email, or password.</p>

        {accountError && (
          <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {accountError}
          </div>
        )}
        {accountSaved && (
          <div className="mb-5 text-sm text-[#05620C] bg-[#E8F4E9] border border-[#05620C]/20 rounded-md px-3 py-2">
            Changes saved.
          </div>
        )}

        <form onSubmit={handleAccountSave} className="space-y-5">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full px-3.5 py-2.5 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
            />
          </div>

          <button
            type="submit"
            disabled={savingAccount}
            className="px-5 py-2.5 rounded-lg text-white font-medium bg-[#05620C] hover:bg-[#034A09] transition disabled:opacity-60"
          >
            {savingAccount ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* System Settings */}
      <div className="bg-white border border-black/5 rounded-xl shadow-sm p-6 h-fit">
        <h1 className="text-lg font-bold text-[#1F2937] mb-1">System Settings</h1>
        <p className="text-sm text-[#6B7280] mb-6">Configure organization-wide defaults.</p>

        {settingsError && (
          <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {settingsError}
          </div>
        )}
        {settingsSaved && (
          <div className="mb-5 text-sm text-[#05620C] bg-[#E8F4E9] border border-[#05620C]/20 rounded-md px-3 py-2">
            Setting saved.
          </div>
        )}

        {loadingSettings ? (
          <p className="text-sm text-[#6B7280]">Loading settings...</p>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-1.5">
                Default role for new signups
              </label>
              <p className="text-xs text-[#6B7280] mb-2">
                New accounts registering through the sign-up page get this role automatically.
              </p>
              <select
                value={settings.default_signup_role}
                onChange={(e) => handleSettingChange("default_signup_role", e.target.value)}
                className="w-full text-sm border border-black/10 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
              >
                {roleOptions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-black/5">
              <div>
                <p className="text-sm font-medium text-[#1F2937]">Allow self-registration</p>
                <p className="text-xs text-[#6B7280]">
                  When off, the public Register page rejects new signups.
                </p>
              </div>
              <button
                onClick={() =>
                  handleSettingChange(
                    "allow_self_registration",
                    settings.allow_self_registration === "true" ? "false" : "true"
                  )
                }
                className={`w-11 h-6 rounded-full transition relative shrink-0 ${
                  settings.allow_self_registration === "true" ? "bg-[#05620C]" : "bg-black/10"
                }`}
                aria-label="Toggle self-registration"
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.allow_self_registration === "true" ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-black/5">
              <div>
                <p className="text-sm font-medium text-[#1F2937]">Maintenance mode</p>
                <p className="text-xs text-[#6B7280]">
                  When on, only Super Admins can log in — everyone else is blocked.
                </p>
              </div>
              <button
                onClick={() =>
                  handleSettingChange(
                    "maintenance_mode",
                    settings.maintenance_mode === "true" ? "false" : "true"
                  )
                }
                className={`w-11 h-6 rounded-full transition relative shrink-0 ${
                  settings.maintenance_mode === "true" ? "bg-red-600" : "bg-black/10"
                }`}
                aria-label="Toggle maintenance mode"
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.maintenance_mode === "true" ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
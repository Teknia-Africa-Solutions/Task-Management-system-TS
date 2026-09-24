import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";
import logo from "../../assets/logo.png";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ background: "#E8F4E9" }}
    >
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Tekniafrica Solutions" className="h-9 w-auto object-contain" />
        </div>

        <div className="bg-white border border-black/5 rounded-2xl shadow-lg p-8 md:p-10">
          <h1 className="text-2xl font-bold text-[#1F2937] mb-1">Create an account</h1>
          <p className="text-sm text-[#6B7280] mb-7">Get started with your team's workspace</p>

          {error && (
            <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Full name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05620C]/30 focus:border-[#05620C]/40 transition"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05620C]/30 focus:border-[#05620C]/40 transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05620C]/30 focus:border-[#05620C]/40 transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Confirm password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05620C]/30 focus:border-[#05620C]/40 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-white font-medium bg-[#05620C] hover:opacity-90 transition disabled:opacity-60 shadow-sm"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-[#6B7280] mt-7 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-[#05620C] font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
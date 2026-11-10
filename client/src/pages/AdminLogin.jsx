
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fffaf3] px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-5 rounded-3xl bg-white p-8 shadow-xl"
      >
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[3px] text-[#b77752]">
            Velvet Drip
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[#513326]">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-[#907a69]">
            Welcome back! Manage your cafe menu.
          </p>
        </div>

        <input
          required
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
          className="w-full rounded-xl border border-[#eadfd2] p-3 outline-none focus:border-[#a35f40]"
        />

        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          className="w-full rounded-xl border border-[#eadfd2] p-3 outline-none focus:border-[#a35f40]"
        />

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#713f2b] p-3 font-semibold text-white transition hover:bg-[#a35f40] disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

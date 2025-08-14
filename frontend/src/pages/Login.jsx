import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [loading, setL] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setL(true);
      await login(username, password);
      nav("/");
    } catch (e) {
      alert("Login failed: " + (e?.response?.data?.error || e.message));
    } finally {
      setL(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome</h1>
        <label className="text-sm font-medium">Username</label>
        <input className="w-full border rounded-lg p-2 mb-3" value={username} onChange={e=>setU(e.target.value)} />
        <label className="text-sm font-medium">Password</label>
        <input type="password" className="w-full border rounded-lg p-2 mb-6" value={password} onChange={e=>setP(e.target.value)} />
        <button disabled={loading} className="w-full py-3 rounded-xl bg-indigo-700 text-white font-semibold">
          {loading ? "Please wait..." : "Login"}
        </button>
        <p className="text-center text-xs text-gray-500 mt-3">First time? This will auto-register your username.</p>
      </form>
    </div>
  );
}

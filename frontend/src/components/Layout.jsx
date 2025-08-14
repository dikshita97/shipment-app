import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

export default function Layout({ children }) {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-semibold"><Link to="/">📦 Shipment App</Link></div>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm hover:underline">Dashboard</Link>
            <Link to="/create" className="text-sm hover:underline">Create Shipment</Link>
            <button onClick={() => { logout(); nav("/login"); }}
              className="text-sm text-red-600 hover:underline">Logout</button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4">{children}</main>
    </div>
  );
}

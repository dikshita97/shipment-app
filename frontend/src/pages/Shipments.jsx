import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const pageSize = 10;
const statuses = [
  "",
  "CREATED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED"
];

export default function Shipments() {
  const { logout } = useAuth();
  const [q, setQ] = useState({
    page: 1,
    search: "",
    status: "",
    sortBy: "createdAt",
    sortDir: "desc"
  });
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total]
  );

  async function load() {
    const { data } = await api.get("/shipments", { params: { ...q, pageSize } });
    setRows(data.rows);
    setTotal(data.total);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [q.page, q.search, q.status, q.sortBy, q.sortDir]);

  async function del(id) {
    if (!confirm("Delete shipment?")) return;
    await api.delete(`/shipments/${id}`);
    load();
  }

  async function aiExplain(s) {
    try {
      const prompt = `Summarize the following shipment in simple language:
Tracking Number: ${s.trackingNumber}
Carrier: ${s.carrier}
From: ${s.origin}
To: ${s.destination}
Status: ${s.status}
Weight: ${s.weightKg} kg
Fragile: ${s.isFragile ? "Yes" : "No"}`;

      const { data } = await api.post("/ai/analyze", { prompt });
      alert(`📦 AI Insight:\n\n${data.response}`);
    } catch (error) {
      console.error(error);
      alert("AI request failed.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Shipments</h1>
          <div className="flex gap-2">
            <input
              placeholder="Search…"
              className="border rounded-lg px-3 py-2"
              value={q.search}
              onChange={(e) => setQ({ ...q, page: 1, search: e.target.value })}
            />
            <select
              className="border rounded-lg px-3 py-2"
              value={q.status}
              onChange={(e) => setQ({ ...q, page: 1, status: e.target.value })}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s || "All statuses"}
                </option>
              ))}
            </select>
            <select
              className="border rounded-lg px-3 py-2"
              value={q.sortBy}
              onChange={(e) => setQ({ ...q, sortBy: e.target.value })}
            >
              <option value="createdAt">Created</option>
              <option value="carrier">Carrier</option>
              <option value="destination">Destination</option>
              <option value="status">Status</option>
            </select>
            <select
              className="border rounded-lg px-3 py-2"
              value={q.sortDir}
              onChange={(e) => setQ({ ...q, sortDir: e.target.value })}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
            <button
              onClick={logout}
              className="px-3 py-2 rounded-lg bg-rose-600 text-white"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-3">Tracking #</th>
                <th className="text-left p-3">Carrier</th>
                <th className="text-left p-3">From → To</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Fragile</th>
                <th className="text-right p-3">Weight (kg)</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-3">{s.trackingNumber}</td>
                  <td className="p-3">{s.carrier}</td>
                  <td className="p-3">
                    {s.origin} → {s.destination}
                  </td>
                  <td className="p-3">{s.status}</td>
                  <td className="p-3">{s.isFragile ? "Yes" : "No"}</td>
                  <td className="p-3 text-right">{s.weightKg.toFixed(2)}</td>
                  <td className="p-3 flex gap-2 justify-end">
                    <button
                      onClick={() => aiExplain(s)}
                      className="px-2 py-1 rounded bg-indigo-600 text-white"
                    >
                      AI
                    </button>
                    <button
                      onClick={() => del(s.id)}
                      className="px-2 py-1 rounded bg-rose-600 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    className="p-6 text-center text-slate-500"
                    colSpan={7}
                  >
                    No shipments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            disabled={q.page <= 1}
            onClick={() => setQ({ ...q, page: q.page - 1 })}
            className="px-3 py-2 border rounded-lg disabled:opacity-50"
          >
            &laquo; Prev
          </button>
          <span className="text-sm">
            Page {q.page} / {totalPages}
          </span>
          <button
            disabled={q.page >= totalPages}
            onClick={() => setQ({ ...q, page: q.page + 1 })}
            className="px-3 py-2 border rounded-lg disabled:opacity-50"
          >
            Next &raquo;
          </button>
        </div>
      </div>
    </div>
  );
}

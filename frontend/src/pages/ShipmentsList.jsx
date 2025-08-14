/*import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function ShipmentsList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const fetch = async () => {
    try {
      const res = await api.get('/api/shipments', { params: { page, limit: 10, search } });
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (e) {
      console.error(e);
      alert('Failed to fetch shipments');
    }
  };

  useEffect(() => { fetch(); }, [page, search]);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <input placeholder="Search by tracking/recipient/origin" value={search} onChange={e => setSearch(e.target.value)} style={{ padding: 6, width: 320 }} />
        <button onClick={() => { setPage(1); fetch(); }} style={{ marginLeft: 8, padding: 6 }}>Search</button>
      </div>

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Tracking</th><th>Carrier</th><th>Route</th><th>Status</th><th>Chargeable kg</th><th>Estimated Delivery</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id}>
              <td>{it.trackingNumber}</td>
              <td>{it.carrier}</td>
              <td>{it.origin} → {it.destination}</td>
              <td>{it.status}</td>
              <td>{it.chargeableWeightKg}</td>
              <td>{it.estimatedDeliveryDate ? new Date(it.estimatedDeliveryDate).toLocaleDateString() : '-'}</td>
              <td>
                <Link to={`/shipments/${it.id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>Prev</button>
        <span style={{ margin: '0 10px' }}>Page {page}</span>
        <button onClick={() => setPage(p => p+1)} disabled={page * 10 >= total}>Next</button>
      </div>
    </div>
  );
}*/

import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function ShipmentsList() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  async function load(){
    const { data } = await api.get("/shipments", { params: { page, limit, search, status, sort, order }});
    setItems(data.items);
    setTotal(data.total);
  }
  useEffect(()=>{ load(); }, [page, limit, search, status, sort, order]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Shipments</h2>
      <div className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="text-sm">Search</label>
          <input className="border rounded p-2 w-64" placeholder="tracking / recipient / route"
                 value={search} onChange={e=>{ setPage(1); setSearch(e.target.value); }} />
        </div>
        <div>
          <label className="text-sm">Status</label>
          <select className="border rounded p-2"
                  value={status} onChange={e=>{ setPage(1); setStatus(e.target.value); }}>
            <option value="">All</option>
            {["CREATED","PICKED_UP","IN_TRANSIT","OUT_FOR_DELIVERY","DELIVERED","CANCELLED","RETURNED"]
              .map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm">Sort</label>
          <select className="border rounded p-2" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="createdAt">Created</option>
            <option value="weightKg">Weight</option>
            <option value="estimatedDeliveryDate">ETA</option>
          </select>
        </div>
        <div>
          <label className="text-sm">Order</label>
          <select className="border rounded p-2" value={order} onChange={e=>setOrder(e.target.value)}>
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
        <div>
          <label className="text-sm">Per page</label>
          <select className="border rounded p-2" value={limit} onChange={e=>{ setPage(1); setLimit(Number(e.target.value)); }}>
            {[5,10,20].map(n=><option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <Link to="/create" className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">+ Create</Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Tracking</th>
              <th className="text-left p-3">Carrier</th>
              <th className="text-left p-3">Route</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Chargeable kg</th>
              <th className="text-left p-3">ETA</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it=>(
              <tr key={it.id} className="border-t">
                <td className="p-3">{it.trackingNumber}</td>
                <td className="p-3">{it.carrier}</td>
                <td className="p-3">{it.origin} → {it.destination}</td>
                <td className="p-3">{it.status}</td>
                <td className="p-3">{it.chargeableWeightKg?.toFixed?.(2) ?? "-"}</td>
                <td className="p-3">{it.estimatedDeliveryDate ? new Date(it.estimatedDeliveryDate).toLocaleDateString() : "-"}</td>
                <td className="p-3">
                  <Link className="text-indigo-600 hover:underline" to={`/shipments/${it.id}`}>View</Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan="7" className="p-6 text-center text-gray-500">No results</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        <span>Page {page}</span>
        <button onClick={()=>setPage(p=>p+1)} disabled={(page*limit)>=total} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}


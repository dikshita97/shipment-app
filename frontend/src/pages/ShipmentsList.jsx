import React, { useEffect, useState } from 'react';
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
}

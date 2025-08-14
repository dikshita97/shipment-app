import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function ShipmentForm() {
  const [form, setForm] = useState({
    trackingNumber: '',
    carrier: '',
    origin: '',
    destination: '',
    recipientName: '',
    weightKg: 1,
    lengthCm: 10,
    widthCm: 10,
    heightCm: 10,
    isFragile: false,
    shippingCost: 0,
    estimatedDeliveryDate: ''
  });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  function computeVolumetric() {
    const vol = (form.lengthCm * form.widthCm * form.heightCm) / 5000;
    return Number(vol.toFixed(2));
  }
  function computeChargeable() {
    return Number(Math.max(form.weightKg, computeVolumetric()).toFixed(2));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/shipments', form);
      alert('Created');
      nav('/');
    } catch (err) {
      console.error(err);
      alert('Error creating shipment: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 700 }}>
      <div>
        <label>Tracking Number</label><br />
        <input required value={form.trackingNumber} onChange={e => setForm({...form, trackingNumber: e.target.value})} />
      </div>
      <div>
        <label>Carrier</label><br />
        <input required value={form.carrier} onChange={e => setForm({...form, carrier: e.target.value})} />
      </div>
      <div>
        <label>Origin</label><br />
        <input required value={form.origin} onChange={e => setForm({...form, origin: e.target.value})} />
      </div>
      <div>
        <label>Destination</label><br />
        <input required value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} />
      </div>
      <div>
        <label>Recipient Name</label><br />
        <input required value={form.recipientName} onChange={e => setForm({...form, recipientName: e.target.value})} />
      </div>
      <div>
        <label>Weight (kg)</label><br />
        <input type="number" step="0.1" value={form.weightKg} onChange={e => setForm({...form, weightKg: Number(e.target.value)})} />
      </div>
      <div>
        <label>Dimensions (cm) — Length × Width × Height</label><br />
        <input type="number" value={form.lengthCm} onChange={e => setForm({...form, lengthCm: Number(e.target.value)})} style={{ width: 80 }} /> ×
        <input type="number" value={form.widthCm} onChange={e => setForm({...form, widthCm: Number(e.target.value)})} style={{ width: 80, marginLeft: 6 }} /> ×
        <input type="number" value={form.heightCm} onChange={e => setForm({...form, heightCm: Number(e.target.value)})} style={{ width: 80, marginLeft: 6 }} />
      </div>
      <div>
        <label>Fragile</label>
        <input type="checkbox" checked={form.isFragile} onChange={e => setForm({...form, isFragile: e.target.checked})} style={{ marginLeft: 8 }} />
      </div>
      <div>
        <label>Estimated Delivery Date</label><br />
        <input type="date" value={form.estimatedDeliveryDate} onChange={e => setForm({...form, estimatedDeliveryDate: e.target.value})} />
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Volumetric weight:</strong> {computeVolumetric()} kg — <strong>Chargeable:</strong> {computeChargeable()} kg
      </div>

      <div style={{ marginTop: 12 }}>
        <button type="submit" disabled={loading}>Create Shipment</button>
      </div>
    </form>
  );
}

/*import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function ShipmentDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    api.get(`/api/shipments/${id}`).then(r => setItem(r.data)).catch(e => {
      console.error(e);
      alert('Failed to load');
    });
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => nav(-1)}>Back</button>
      <h2>{item.trackingNumber} — {item.status}</h2>
      <p><strong>Carrier:</strong> {item.carrier}</p>
      <p><strong>Route:</strong> {item.origin} → {item.destination}</p>
      <p><strong>Recipient:</strong> {item.recipientName}</p>
      <p><strong>Weight:</strong> {item.weightKg} kg</p>
      <p><strong>Dimensions:</strong> {item.lengthCm} × {item.widthCm} × {item.heightCm} cm</p>
      <p><strong>Volumetric weight:</strong> {item.volumetricWeightKg} kg</p>
      <p><strong>Chargeable weight:</strong> {item.chargeableWeightKg} kg</p>
      <p><strong>Estimated delivery:</strong> {item.estimatedDeliveryDate ? new Date(item.estimatedDeliveryDate).toLocaleString() : '-'}</p>
      <p><strong>Shipped at:</strong> {item.shippedAt ? new Date(item.shippedAt).toLocaleString() : '-'}</p>
      <p><strong>Delivered at:</strong> {item.deliveredAt ? new Date(item.deliveredAt).toLocaleString() : '-'}</p>
    </div>
  );
}*/
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ShipmentDetail(){
  const { id } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState(null);

  async function load(){
    try {
      const { data } = await api.get(`/shipments/${id}`);
      setItem(data);
    } catch (e) {
      alert("Failed to load");
    }
  }
  useEffect(()=>{ load(); }, [id]);

  async function remove(){
    if (!confirm("Delete this shipment?")) return;
    await api.delete(`/shipments/${id}`);
    nav("/");
  }

  if (!item) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl space-y-3">
      <button className="text-sm underline" onClick={()=>nav(-1)}>← Back</button>
      <h2 className="text-xl font-semibold">{item.trackingNumber} — {item.status}</h2>
      <div className="bg-white rounded-xl shadow p-4 space-y-1">
        <p><b>Carrier:</b> {item.carrier}</p>
        <p><b>Route:</b> {item.origin} → {item.destination}</p>
        <p><b>Recipient:</b> {item.recipientName}</p>
        <p><b>Weight:</b> {item.weightKg} kg</p>
        <p><b>Dimensions:</b> {item.lengthCm} × {item.widthCm} × {item.heightCm} cm</p>
        <p><b>Volumetric:</b> {item.volumetricWeightKg} kg</p>
        <p><b>Chargeable:</b> {item.chargeableWeightKg} kg</p>
        <p><b>ETA:</b> {item.estimatedDeliveryDate ? new Date(item.estimatedDeliveryDate).toLocaleString() : "-"}</p>
      </div>
      <button onClick={remove} className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
    </div>
  );
}


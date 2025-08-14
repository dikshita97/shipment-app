import React, { useEffect, useState } from 'react';
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
}

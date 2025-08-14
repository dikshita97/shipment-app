/*import React, { useState } from 'react';
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
}*/
import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ShipmentForm(){
  const [form, setForm] = useState({
    trackingNumber: "", carrier: "", origin: "", destination: "",
    recipientName: "", status: "CREATED",
    weightKg: 1, lengthCm: 10, widthCm: 10, heightCm: 10,
    isFragile: false, shippingCost: 0, estimatedDeliveryDate: ""
  });
  const [aiDesc, setAiDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const volumetric = ((form.lengthCm*form.widthCm*form.heightCm)/5000).toFixed(2);
  const chargeable = Math.max(Number(form.weightKg), Number(volumetric)).toFixed(2);

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/shipments", {
        ...form,
        weightKg: Number(form.weightKg),
        lengthCm: Number(form.lengthCm),
        widthCm: Number(form.widthCm),
        heightCm: Number(form.heightCm),
        shippingCost: Number(form.shippingCost || 0),
        estimatedDeliveryDate: form.estimatedDeliveryDate || null,
      });
      alert("Created!");
      nav("/");
    } catch (e) {
      alert("Error: " + (e.response?.data?.error || e.message));
    } finally { setLoading(false); }
  }

  async function generateAI(){
    try {
      const { data } = await api.post("/shipments/ai-description", {
        trackingNumber: form.trackingNumber,
        carrier: form.carrier,
        route: `${form.origin} to ${form.destination}`,
        status: form.status,
        chargeableWeightKg: chargeable,
        eta: form.estimatedDeliveryDate
      });
      setAiDesc(data.description);
    } catch (e) {
      alert("AI failed: " + (e.response?.data?.error || e.message));
    }
  }

  function field(name, props={}){
    return (
      <input className="border rounded p-2 w-full"
             value={form[name]} onChange={e=>setForm({...form, [name]: e.target.value})} {...props}/>
    );
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Create Shipment</h2>
      <form onSubmit={submit} className="bg-white rounded-xl shadow p-4 grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm">Tracking Number</label>{field("trackingNumber")}</div>
          <div><label className="text-sm">Carrier</label>{field("carrier")}</div>
          <div><label className="text-sm">Origin</label>{field("origin")}</div>
          <div><label className="text-sm">Destination</label>{field("destination")}</div>
          <div><label className="text-sm">Recipient</label>{field("recipientName")}</div>
          <div>
            <label className="text-sm">Status</label>
            <select className="border rounded p-2 w-full" value={form.status}
              onChange={e=>setForm({...form, status: e.target.value})}>
              {["CREATED","PICKED_UP","IN_TRANSIT","OUT_FOR_DELIVERY","DELIVERED","CANCELLED","RETURNED"].map(s=>
                <option key={s} value={s}>{s}</option>
              )}
            </select>
          </div>
          <div><label className="text-sm">Weight (kg)</label>{field("weightKg", {type:"number", step:"0.1"})}</div>
          <div><label className="text-sm">Length (cm)</label>{field("lengthCm", {type:"number"})}</div>
          <div><label className="text-sm">Width (cm)</label>{field("widthCm", {type:"number"})}</div>
          <div><label className="text-sm">Height (cm)</label>{field("heightCm", {type:"number"})}</div>
          <div className="flex items-center gap-2">
            <input id="fragile" type="checkbox" checked={form.isFragile}
                   onChange={e=>setForm({...form, isFragile: e.target.checked})}/>
            <label htmlFor="fragile">Fragile</label>
          </div>
          <div><label className="text-sm">Estimated Delivery</label>{field("estimatedDeliveryDate", {type:"date"})}</div>
        </div>

        <div className="bg-gray-50 rounded p-3">
          <div><b>Volumetric:</b> {volumetric} kg | <b>Chargeable:</b> {chargeable} kg</div>
        </div>

        <div className="space-y-2">
          <button type="button" onClick={generateAI}
                  className="px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700">
            ✨ Generate AI Description
          </button>
          {aiDesc && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">{aiDesc}</div>}
        </div>

        <div>
          <button disabled={loading} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">
            {loading ? "Saving..." : "Create Shipment"}
          </button>
        </div>
      </form>
    </div>
  );
}


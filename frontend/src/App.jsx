import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ShipmentsList from './pages/ShipmentsList';
import ShipmentForm from './pages/ShipmentForm';
import ShipmentDetail from './pages/ShipmentDetail';

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: 20 }}>
        <h1>Shipment App</h1>
        <nav>
          <Link to="/" style={{ marginRight: 10 }}>Shipments</Link>
          <Link to="/create">Create Shipment</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<ShipmentsList />} />
        <Route path="/create" element={<ShipmentForm />} />
        <Route path="/shipments/:id" element={<ShipmentDetail />} />
      </Routes>
    </div>
  );
}


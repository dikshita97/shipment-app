// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

// Utility: compute volumetricWeightKg and chargeableWeightKg
function computeWeights(shipment) {
  const vol = (shipment.lengthCm * shipment.widthCm * shipment.heightCm) / 5000;
  const volumetricWeightKg = Number(vol.toFixed(2));
  const chargeableWeightKg = Number(Math.max(shipment.weightKg, volumetricWeightKg).toFixed(2));
  return { volumetricWeightKg, chargeableWeightKg };
}

// Allowed status transitions and side-effects
const allowedTransitions = {
  CREATED: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['IN_TRANSIT', 'RETURNED'],
  IN_TRANSIT: ['OUT_FOR_DELIVERY', 'RETURNED', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'RETURNED'],
  DELIVERED: [],
  CANCELLED: [],
  RETURNED: []
};

function validateStatusTransition(current, next) {
  if (!current) return true;
  return allowedTransitions[current] && allowedTransitions[current].includes(next);
}

// Creating shipment
app.post('/api/shipments', async (req, res) => {
  try {
    const data = req.body;
    // Basic validation
    if (!data.trackingNumber || !data.carrier || !data.origin || !data.destination || !data.recipientName) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    // Numeric validation
    if (data.weightKg <= 0 || data.lengthCm <= 0 || data.widthCm <= 0 || data.heightCm <= 0) {
      return res.status(400).json({ error: 'Weight and dimensions must be positive numbers.' });
    }

    // Create in DB
    const created = await prisma.shipment.create({
      data: {
        trackingNumber: data.trackingNumber,
        carrier: data.carrier,
        origin: data.origin,
        destination: data.destination,
        recipientName: data.recipientName,
        status: data.status || 'CREATED',
        weightKg: Number(data.weightKg),
        lengthCm: Number(data.lengthCm),
        widthCm: Number(data.widthCm),
        heightCm: Number(data.heightCm),
        isFragile: !!data.isFragile,
        shippingCost: Number(data.shippingCost || 0),
        estimatedDeliveryDate: data.estimatedDeliveryDate ? new Date(data.estimatedDeliveryDate) : null
      }
    });

    const withWeights = { ...created, ...computeWeights(created) };
    res.status(201).json(withWeights);
  } catch (err) {
    if (err.code === 'P2002') { // unique constraint
      return res.status(400).json({ error: 'trackingNumber must be unique.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Listing shipments with pagination, filters, search, sort
app.get('/api/shipments', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(100, parseInt(req.query.limit || '10'));
    const skip = (page - 1) * limit;

    const where = {};
    if (req.query.carrier) where.carrier = String(req.query.carrier);
    if (req.query.status) {
      const statuses = Array.isArray(req.query.status) ? req.query.status : String(req.query.status).split(',');
      where.status = { in: statuses };
    }
    if (req.query.search) {
      const s = String(req.query.search);
      where.OR = [
        { trackingNumber: { contains: s, mode: 'insensitive' } },
        { recipientName: { contains: s, mode: 'insensitive' } },
        { origin: { contains: s, mode: 'insensitive' } },
        { destination: { contains: s, mode: 'insensitive' } }
      ];
    }

    // sorting
    let orderBy = { createdAt: 'desc' };
    if (req.query.sort) {
      const key = String(req.query.sort).replace('-', '');
      const dir = String(req.query.sort).startsWith('-') ? 'desc' : 'asc';
      orderBy = { [key]: dir };
    }

    const [items, total] = await Promise.all([
      prisma.shipment.findMany({ where, skip, take: limit, orderBy }),
      prisma.shipment.count({ where })
    ]);

    const itemsWithWeights = items.map(it => ({ ...it, ...computeWeights(it) }));
    res.json({ page, limit, total, items: itemsWithWeights });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get one
app.get('/api/shipments/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const item = await prisma.shipment.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ ...item, ...computeWeights(item) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Updating shipment (status transition validated)
app.put('/api/shipments/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const existing = await prisma.shipment.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    if (data.status && data.status !== existing.status) {
      // validating transition
      if (!validateStatusTransition(existing.status, data.status)) {
        return res.status(400).json({ error: `Invalid status transition from ${existing.status} to ${data.status}` });
      }
      // side-effects
      if (data.status === 'PICKED_UP' && !existing.shippedAt) {
        data.shippedAt = new Date().toISOString();
      }
      if (data.status === 'DELIVERED' && !existing.deliveredAt) {
        data.deliveredAt = new Date().toISOString();
      }
    }

    // updating allowed fields
    const updated = await prisma.shipment.update({
      where: { id },
      data: {
        trackingNumber: data.trackingNumber || existing.trackingNumber,
        carrier: data.carrier || existing.carrier,
        origin: data.origin || existing.origin,
        destination: data.destination || existing.destination,
        recipientName: data.recipientName || existing.recipientName,
        status: data.status || existing.status,
        weightKg: data.weightKg !== undefined ? Number(data.weightKg) : existing.weightKg,
        lengthCm: data.lengthCm !== undefined ? Number(data.lengthCm) : existing.lengthCm,
        widthCm: data.widthCm !== undefined ? Number(data.widthCm) : existing.widthCm,
        heightCm: data.heightCm !== undefined ? Number(data.heightCm) : existing.heightCm,
        isFragile: data.isFragile !== undefined ? !!data.isFragile : existing.isFragile,
        shippingCost: data.shippingCost !== undefined ? Number(data.shippingCost) : existing.shippingCost,
        shippedAt: data.shippedAt !== undefined ? (data.shippedAt ? new Date(data.shippedAt) : null) : existing.shippedAt,
        estimatedDeliveryDate: data.estimatedDeliveryDate !== undefined ? (data.estimatedDeliveryDate ? new Date(data.estimatedDeliveryDate) : null) : existing.estimatedDeliveryDate,
        deliveredAt: data.deliveredAt !== undefined ? (data.deliveredAt ? new Date(data.deliveredAt) : null) : existing.deliveredAt
      }
    });

    res.json({ ...updated, ...computeWeights(updated) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Deleting shipment
app.delete('/api/shipments/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.shipment.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

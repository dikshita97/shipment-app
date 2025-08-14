import express from "express";
import { z } from "zod";
import { authRequired } from "../middleware/auth.js";
import { ShipmentService } from "../services/shipment.service.js";
import { generateShipmentDescription } from "../services/gemini.service.js";

const router = express.Router();

const shipmentSchema = z.object({
  trackingNumber: z.string(),
  carrier: z.string(),
  origin: z.string(),
  destination: z.string(),
  recipientName: z.string(),
  status: z.enum([
    "CREATED","PICKED_UP","IN_TRANSIT","OUT_FOR_DELIVERY","DELIVERED","CANCELLED","RETURNED"
  ]).default("CREATED"),
  weightKg: z.number(),
  lengthCm: z.number().int(),
  widthCm: z.number().int(),
  heightCm: z.number().int(),
  isFragile: z.boolean().default(false),
  shippingCost: z.number().default(0),
  shippedAt: z.string().datetime().optional().nullable(),
  estimatedDeliveryDate: z.string().datetime().optional().nullable(),
  deliveredAt: z.string().datetime().optional().nullable(),
});

/**
 * @swagger
 * /shipments:
 *   get:
 *     summary: List shipments (paginated, filter, search, sort)
 *     tags: [Shipments]
 */
router.get("/", authRequired, async (req, res, next) => {
  try {
    const { page, limit, search, status, sort, order } = req.query;
    const data = await ShipmentService.list(req.user.id, { page, limit, search, status, sort, order });
    res.json(data);
  } catch (e) { next(e); }
});

/**
 * @swagger
 * /shipments:
 *   post:
 *     summary: Create shipment
 *     tags: [Shipments]
 */
router.post("/", authRequired, async (req, res, next) => {
  try {
    const parsed = shipmentSchema.parse({
      ...req.body,
      weightKg: Number(req.body.weightKg),
      lengthCm: Number(req.body.lengthCm),
      widthCm: Number(req.body.widthCm),
      heightCm: Number(req.body.heightCm),
      shippingCost: Number(req.body.shippingCost ?? 0),
    });
    const created = await ShipmentService.create(req.user.id, parsed);
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.get("/:id", authRequired, async (req, res, next) => {
  try {
    const item = await ShipmentService.get(req.user.id, req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e) { next(e); }
});

router.put("/:id", authRequired, async (req, res, next) => {
  try {
    const parsed = shipmentSchema.partial().parse(req.body);
    const updated = await ShipmentService.update(req.user.id, req.params.id, parsed);
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete("/:id", authRequired, async (req, res, next) => {
  try {
    const result = await ShipmentService.remove(req.user.id, req.params.id);
    res.json(result);
  } catch (e) { next(e); }
});

/**
 * @swagger
 * /shipments/ai-description:
 *   post:
 *     summary: Generate AI description via Gemini
 *     tags: [Shipments]
 */
router.post("/ai-description", authRequired, async (req, res, next) => {
  try {
    const description = await generateShipmentDescription(req.body);
    res.json({ description });
  } catch (e) { next(e); }
});

export default router;

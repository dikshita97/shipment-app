// backend/src/routes/shipmentRoutes.js
import { Router } from "express";
import { shipmentController } from "../controllers/shipmentController.js";
import { authRequired } from "../middleware/auth.js";

const r = Router();

// Protect all shipment routes
r.use(authRequired);

r.get("/", shipmentController.list);
r.get("/:id", shipmentController.get);
r.post("/", shipmentController.create);
r.put("/:id", shipmentController.update);
r.delete("/:id", shipmentController.remove);

export default r;

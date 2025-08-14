/*import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import shipmentRoutes from "./routes/shipment.routes.js";
import { errorHandler } from "./middleware/error.js";
import { swaggerDocs } from "./docs/swagger.js";
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => res.json({ ok: true, service: "shipment-api" }));
app.use("/auth", authRoutes);
app.use("/shipments", shipmentRoutes);

swaggerDocs(app);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));*/


import "dotenv/config";
import app from "./app.js";
import { config } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
app.use("/", authRoutes); // register first


app.listen(config.port, () => {
  console.log(`Swagger UI at /api-docs`);
  console.log(`API listening on http://localhost:${config.port}`);
});

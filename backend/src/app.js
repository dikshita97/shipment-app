import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { config } from "./config/env.js";

import authRoutes from "./routes/authRoutes.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();
app.use(express.json());
app.use("/ai", aiRoutes);
app.use(cors({ origin: config.corsOrigin, credentials: true }));

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Shipment API", version: "1.0.0" },
    components: {
      securitySchemes: { bearerAuth: { type: "http", scheme: "bearer" } },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [], // (optional) you can point to route files with JSDoc comments
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/login", authRoutes);
app.use("/shipments", shipmentRoutes);
app.use("/ai", aiRoutes);

export default app;

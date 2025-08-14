import { shipmentRepo } from "../repositories/shipmentRepo.js";
import { shipmentService } from "../services/shipmentService.js";

export const shipmentController = {
  async create(req, res) {
    const userId = req.user.id;
    const body = req.body;
    const created = await shipmentRepo.create(userId, body);
    const chargeableWeightKg = shipmentService.chargeableWeightKg(created);
    res.status(201).json({ ...created, _calc: { chargeableWeightKg } });
  },
  async list(req, res) {
    const userId = req.user.id;
    const {
      page = 1, pageSize = 10, search = "", status = "", sortBy = "createdAt", sortDir = "desc",
    } = req.query;
    const [rows, total] = await shipmentRepo.list(userId, {
      page: Number(page), pageSize: Number(pageSize), search, status: status || undefined, sortBy, sortDir
    });
    res.json({ total, page: Number(page), pageSize: Number(pageSize), rows });
  },
  async get(req, res) {
    const row = await shipmentRepo.getById(Number(req.params.id), req.user.id);
    if (!row) return res.status(404).json({ error: "Not found" });
    const chargeableWeightKg = shipmentService.chargeableWeightKg(row);
    res.json({ ...row, _calc: { chargeableWeightKg } });
  },
  async update(req, res) {
    const updated = await shipmentRepo.update(Number(req.params.id), req.user.id, req.body);
    const chargeableWeightKg = shipmentService.chargeableWeightKg(updated);
    res.json({ ...updated, _calc: { chargeableWeightKg } });
  },
  async remove(req, res) {
    await shipmentRepo.remove(Number(req.params.id), req.user.id);
    res.status(204).end();
  },
};

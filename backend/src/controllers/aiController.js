import { summarizeShipment } from "../utils/gemini.js";

export const aiController = {
  async summarize(req, res) {
    try {
      const text = await summarizeShipment(req.body); // expects shipment JSON
      res.json({ text });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
};

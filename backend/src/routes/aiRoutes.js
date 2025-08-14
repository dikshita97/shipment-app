import express from "express";
import { analyzeShipmentPrompt } from "../utils/gemini.js";
const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    const aiResponse = await analyzeShipmentPrompt(prompt);
    res.json({ response: aiResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

export default router;

import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateShipmentDescription(input) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
You are a helpful logistics assistant. Create a short, user-friendly shipment description (2–3 sentences).
Inputs: ${JSON.stringify(input)}
Include route, current status, chargeable weight (if provided) and an ETA if present.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

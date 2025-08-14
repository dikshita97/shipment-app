import express from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { UserService } from "../services/user.service.js";
import bcrypt from "bcrypt";

const router = express.Router();

const credsSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(4),
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user
 *     tags: [Auth]
 */
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = credsSchema.parse(req.body);
    const existing = await UserService.findByUsername(username);
    if (existing) return res.status(400).json({ error: "Username taken" });
    const user = await UserService.createUser(username, password);
    res.json({ id: user.id, username: user.username });
  } catch (e) { next(e); }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and get JWT
 *     tags: [Auth]
 */
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = credsSchema.parse(req.body);
    const user = await UserService.findByUsername(username);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "2d" });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (e) { next(e); }
});

export default router;

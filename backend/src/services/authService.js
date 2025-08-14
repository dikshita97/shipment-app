import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepo } from "../repositories/userRepo.js";
import { config } from "../config/env.js";

export const authService = {
  async loginOrRegister(username, password) {
    let user = await userRepo.findByUsername(username);
    if (!user) {
      const hash = await bcrypt.hash(password, 10);
      user = await userRepo.create(username, hash);
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Invalid credentials");
    const token = jwt.sign({ id: user.id, username: user.username }, config.jwtSecret, { expiresIn: "6h" });
    return { token, user: { id: user.id, username: user.username } };
  },
};

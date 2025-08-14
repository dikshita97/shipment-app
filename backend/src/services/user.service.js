import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export const UserService = {
  async createUser(username, password) {
    const hashed = await bcrypt.hash(password, 10);
    return prisma.user.create({ data: { username, password: hashed } });
  },
  async findByUsername(username) {
    return prisma.user.findUnique({ where: { username } });
  },
};

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const userRepo = {
  findByUsername: (username) => prisma.user.findUnique({ where: { username } }),
  create: (username, passwordHash) =>
    prisma.user.create({ data: { username, password: passwordHash } }),
};

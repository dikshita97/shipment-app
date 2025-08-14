import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const shipmentRepo = {
  create: (userId, data) => prisma.shipment.create({ data: { ...data, userId } }),
  update: (id, userId, data) =>
    prisma.shipment.update({ where: { id }, data: { ...data, userId } }),
  remove: (id, userId) => prisma.shipment.delete({ where: { id } }),
  getById: (id, userId) =>
    prisma.shipment.findFirst({ where: { id, userId } }),
  list: (userId, { page, pageSize, search, status, sortBy, sortDir }) => {
    const skip = (page - 1) * pageSize;
    const where = {
      userId,
      AND: [
        search
          ? {
              OR: [
                { trackingNumber: { contains: search, mode: "insensitive" } },
                { origin: { contains: search, mode: "insensitive" } },
                { destination: { contains: search, mode: "insensitive" } },
                { carrier: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        status ? { status } : {},
      ],
    };
    const orderBy = sortBy ? { [sortBy]: sortDir === "desc" ? "desc" : "asc" } : { createdAt: "desc" };
    return prisma.$transaction([
      prisma.shipment.findMany({ where, skip, take: pageSize, orderBy }),
      prisma.shipment.count({ where }),
    ]);
  },
};

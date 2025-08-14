import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function volumetricWeightKg({ lengthCm, widthCm, heightCm }) {
  return Number(((lengthCm * widthCm * heightCm) / 5000).toFixed(2));
}
function chargeableWeightKg({ weightKg, lengthCm, widthCm, heightCm }) {
  return Math.max(weightKg, volumetricWeightKg({ lengthCm, widthCm, heightCm }));
}

export const ShipmentService = {
  list: async (userId, { page=1, limit=10, search="", status, sort="createdAt", order="desc" }) => {
    const where = {
      userId,
      ...(status ? { status } : {}),
      ...(search
        ? { OR: [
              { trackingNumber: { contains: search, mode: "insensitive" } },
              { carrier: { contains: search, mode: "insensitive" } },
              { origin: { contains: search, mode: "insensitive" } },
              { destination: { contains: search, mode: "insensitive" } },
              { recipientName: { contains: search, mode: "insensitive" } },
           ] }
        : {}
      ),
    };
    const skip = (Number(page)-1) * Number(limit);
    const [total, itemsRaw] = await Promise.all([
      prisma.shipment.count({ where }),
      prisma.shipment.findMany({
        where, skip, take: Number(limit),
        orderBy: { [sort]: order === "asc" ? "asc" : "desc" },
      })
    ]);
    const items = itemsRaw.map(it => ({
      ...it,
      volumetricWeightKg: volumetricWeightKg(it),
      chargeableWeightKg: Number(chargeableWeightKg(it).toFixed(2)),
    }));
    return { total, items };
  },

  create: async (userId, data) => {
    return prisma.shipment.create({ data: { ...data, userId } });
  },

  get: async (userId, id) => {
    const it = await prisma.shipment.findFirst({ where: { id: Number(id), userId } });
    if (!it) return null;
    return {
      ...it,
      volumetricWeightKg: volumetricWeightKg(it),
      chargeableWeightKg: Number(chargeableWeightKg(it).toFixed(2)),
    };
  },

  update: async (userId, id, data) => {
    // ensure ownership
    await prisma.shipment.findFirstOrThrow({ where: { id: Number(id), userId } });
    return prisma.shipment.update({ where: { id: Number(id) }, data });
  },

  remove: async (userId, id) => {
    // ensure ownership
    await prisma.shipment.findFirstOrThrow({ where: { id: Number(id), userId } });
    await prisma.shipment.delete({ where: { id: Number(id) } });
    return { ok: true };
  },
};

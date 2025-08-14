// backend/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const samples = [
    {
      trackingNumber: 'TRK1001',
      carrier: 'BlueDart',
      origin: 'Mumbai',
      destination: 'Delhi',
      recipientName: 'Ayesha',
      status: 'CREATED',
      weightKg: 2.5,
      lengthCm: 30, widthCm: 20, heightCm: 10,
      isFragile: false,
      shippingCost: 150,
      estimatedDeliveryDate: new Date(Date.now() + 3*24*60*60*1000)
    },
    {
      trackingNumber: 'TRK1002',
      carrier: 'FedEx',
      origin: 'Bengaluru',
      destination: 'Hyderabad',
      recipientName: 'Rohit',
      status: 'PICKED_UP',
      weightKg: 1.2,
      lengthCm: 25, widthCm: 15, heightCm: 10,
      isFragile: true,
      shippingCost: 120,
      estimatedDeliveryDate: new Date(Date.now() + 2*24*60*60*1000)
    }
  ];

  for (const s of samples) {
    try {
      await prisma.shipment.create({ data: s });
    } catch (e) {
      // ignore if already exists
    }
  }
  console.log('Seed done');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

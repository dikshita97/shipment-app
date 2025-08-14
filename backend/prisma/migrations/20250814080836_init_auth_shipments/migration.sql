-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Shipment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trackingNumber" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "weightKg" REAL NOT NULL,
    "lengthCm" INTEGER NOT NULL,
    "widthCm" INTEGER NOT NULL,
    "heightCm" INTEGER NOT NULL,
    "isFragile" BOOLEAN NOT NULL DEFAULT false,
    "shippingCost" REAL NOT NULL,
    "shippedAt" DATETIME,
    "estimatedDeliveryDate" DATETIME,
    "deliveredAt" DATETIME,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Shipment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Shipment" ("carrier", "createdAt", "deliveredAt", "destination", "estimatedDeliveryDate", "heightCm", "id", "isFragile", "lengthCm", "origin", "recipientName", "shippedAt", "shippingCost", "status", "trackingNumber", "updatedAt", "userId", "weightKg", "widthCm") SELECT "carrier", "createdAt", "deliveredAt", "destination", "estimatedDeliveryDate", "heightCm", "id", "isFragile", "lengthCm", "origin", "recipientName", "shippedAt", "shippingCost", "status", "trackingNumber", "updatedAt", "userId", "weightKg", "widthCm" FROM "Shipment";
DROP TABLE "Shipment";
ALTER TABLE "new_Shipment" RENAME TO "Shipment";
CREATE UNIQUE INDEX "Shipment_trackingNumber_key" ON "Shipment"("trackingNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

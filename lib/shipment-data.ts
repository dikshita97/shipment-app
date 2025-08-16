import type { Shipment } from "./types"
import { createShipmentWithCalculations } from "./shipment-calculations"

// Hardcoded shipment data as required (no database)
const SAMPLE_SHIPMENTS_INPUT = [
  {
    trackingNumber: "TRK001234567",
    description: "Electronics - Laptop Computer",
    senderName: "TechCorp Inc.",
    senderAddress: "123 Tech Street, San Francisco, CA 94105",
    recipientName: "John Smith",
    recipientAddress: "456 Oak Avenue, Los Angeles, CA 90210",
    status: "in-transit" as const,
    shippingMethod: "express" as const,
    priority: "high" as const,
    isPriority: true,
    isInsured: true,
    requiresSignature: true,
    weight: 2.5,
    distance: 615,
    declaredValue: 1200,
  },
  {
    trackingNumber: "TRK001234568",
    description: "Documents - Legal Papers",
    senderName: "Law Firm Associates",
    senderAddress: "789 Legal Blvd, New York, NY 10001",
    recipientName: "Sarah Johnson",
    recipientAddress: "321 Business St, Boston, MA 02101",
    status: "delivered" as const,
    shippingMethod: "overnight" as const,
    priority: "urgent" as const,
    isPriority: true,
    isInsured: false,
    requiresSignature: true,
    weight: 0.5,
    distance: 306,
    declaredValue: 50,
  },
  {
    trackingNumber: "TRK001234569",
    description: "Clothing - Fashion Items",
    senderName: "Fashion Boutique",
    senderAddress: "555 Style Ave, Miami, FL 33101",
    recipientName: "Emily Davis",
    recipientAddress: "888 Trend Lane, Atlanta, GA 30301",
    status: "pending" as const,
    shippingMethod: "standard" as const,
    priority: "medium" as const,
    isPriority: false,
    isInsured: true,
    requiresSignature: false,
    weight: 1.2,
    distance: 662,
    declaredValue: 300,
  },
  {
    trackingNumber: "TRK001234570",
    description: "Medical Supplies - Emergency Kit",
    senderName: "MedSupply Corp",
    senderAddress: "999 Health Dr, Chicago, IL 60601",
    recipientName: "City Hospital",
    recipientAddress: "111 Care Blvd, Detroit, MI 48201",
    status: "out-for-delivery" as const,
    shippingMethod: "same-day" as const,
    priority: "urgent" as const,
    isPriority: true,
    isInsured: true,
    requiresSignature: true,
    weight: 5.0,
    distance: 459,
    declaredValue: 800,
  },
  {
    trackingNumber: "TRK001234571",
    description: "Books - Educational Materials",
    senderName: "Academic Publishers",
    senderAddress: "222 Knowledge St, Seattle, WA 98101",
    recipientName: "University Library",
    recipientAddress: "333 Campus Dr, Portland, OR 97201",
    status: "confirmed" as const,
    shippingMethod: "standard" as const,
    priority: "low" as const,
    isPriority: false,
    isInsured: false,
    requiresSignature: false,
    weight: 3.8,
    distance: 278,
    declaredValue: 150,
  },
  {
    trackingNumber: "TRK001234572",
    description: "Automotive Parts - Engine Components",
    senderName: "Auto Parts Direct",
    senderAddress: "777 Motor Way, Houston, TX 77001",
    recipientName: "Repair Shop Pro",
    recipientAddress: "444 Fix It Rd, Dallas, TX 75201",
    status: "picked-up" as const,
    shippingMethod: "express" as const,
    priority: "high" as const,
    isPriority: true,
    isInsured: true,
    requiresSignature: true,
    weight: 15.5,
    distance: 362,
    declaredValue: 2500,
  },
  {
    trackingNumber: "TRK001234573",
    description: "Food Items - Gourmet Chocolates",
    senderName: "Sweet Delights",
    senderAddress: "666 Candy Lane, Phoenix, AZ 85001",
    recipientName: "Maria Rodriguez",
    recipientAddress: "555 Desert View, Las Vegas, NV 89101",
    status: "cancelled" as const,
    shippingMethod: "overnight" as const,
    priority: "medium" as const,
    isPriority: false,
    isInsured: false,
    requiresSignature: false,
    weight: 2.0,
    distance: 414,
    declaredValue: 75,
  },
  {
    trackingNumber: "TRK001234574",
    description: "Furniture - Office Chair",
    senderName: "Office Solutions",
    senderAddress: "888 Work Plaza, Denver, CO 80201",
    recipientName: "StartUp Inc.",
    recipientAddress: "999 Innovation Blvd, Salt Lake City, UT 84101",
    status: "returned" as const,
    shippingMethod: "standard" as const,
    priority: "low" as const,
    isPriority: false,
    isInsured: true,
    requiresSignature: true,
    weight: 22.0,
    distance: 525,
    declaredValue: 450,
  },
]

// Generate complete shipments with calculated fields
export const DEMO_SHIPMENTS: Shipment[] = SAMPLE_SHIPMENTS_INPUT.map((input, index) => {
  // Create shipments with specific IDs for consistency
  const shipment = createShipmentWithCalculations(input, `SHP-${String(index + 1).padStart(3, "0")}`)

  // Set some shipments as delivered with actual delivery dates
  if (input.status === "delivered") {
    const deliveredDate = new Date()
    deliveredDate.setDate(deliveredDate.getDate() - Math.floor(Math.random() * 5) - 1)
    shipment.actualDeliveryDate = deliveredDate.toISOString()
  }

  return shipment
})

// Export count for pagination
export const TOTAL_SHIPMENTS = DEMO_SHIPMENTS.length

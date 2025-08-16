import { NextResponse } from "next/server"
import { getShipmentStats } from "@/lib/shipment-service"

// GET /api/shipments/stats - Get shipment statistics
export async function GET() {
  try {
    const stats = getShipmentStats()

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Error fetching shipment stats:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch shipment statistics",
      },
      { status: 500 },
    )
  }
}

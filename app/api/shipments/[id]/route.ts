import { type NextRequest, NextResponse } from "next/server"
import { getShipmentById, updateShipment, deleteShipment } from "@/lib/shipment-service"
import type { CreateShipmentInput } from "@/lib/types"

// GET /api/shipments/[id] - Get single shipment
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const shipment = getShipmentById(params.id)

    if (!shipment) {
      return NextResponse.json(
        {
          success: false,
          error: "Shipment not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: shipment,
    })
  } catch (error) {
    console.error("Error fetching shipment:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch shipment",
      },
      { status: 500 },
    )
  }
}

// PUT /api/shipments/[id] - Update shipment
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Check if shipment exists
    const existingShipment = getShipmentById(params.id)
    if (!existingShipment) {
      return NextResponse.json(
        {
          success: false,
          error: "Shipment not found",
        },
        { status: 404 },
      )
    }

    // Validate numeric fields if provided
    if (body.weight !== undefined && (typeof body.weight !== "number" || body.weight <= 0)) {
      return NextResponse.json(
        {
          success: false,
          error: "Weight must be a positive number",
        },
        { status: 400 },
      )
    }

    if (body.distance !== undefined && (typeof body.distance !== "number" || body.distance <= 0)) {
      return NextResponse.json(
        {
          success: false,
          error: "Distance must be a positive number",
        },
        { status: 400 },
      )
    }

    if (body.declaredValue !== undefined && (typeof body.declaredValue !== "number" || body.declaredValue < 0)) {
      return NextResponse.json(
        {
          success: false,
          error: "Declared value must be a non-negative number",
        },
        { status: 400 },
      )
    }

    // Prepare update data
    const updateData: Partial<CreateShipmentInput> = {}

    // Only include fields that are provided
    const allowedFields = [
      "trackingNumber",
      "description",
      "senderName",
      "senderAddress",
      "recipientName",
      "recipientAddress",
      "status",
      "shippingMethod",
      "priority",
      "isPriority",
      "isInsured",
      "requiresSignature",
      "weight",
      "distance",
      "declaredValue",
    ]

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field as keyof CreateShipmentInput] = body[field]
      }
    }

    const updatedShipment = updateShipment(params.id, updateData)

    if (!updatedShipment) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update shipment",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedShipment,
      message: "Shipment updated successfully",
    })
  } catch (error) {
    console.error("Error updating shipment:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update shipment",
      },
      { status: 500 },
    )
  }
}

// DELETE /api/shipments/[id] - Delete shipment
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = deleteShipment(params.id)

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Shipment not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Shipment deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting shipment:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete shipment",
      },
      { status: 500 },
    )
  }
}

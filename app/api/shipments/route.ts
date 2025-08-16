import { type NextRequest, NextResponse } from "next/server"
import { getShipments, createShipment } from "@/lib/shipment-service"
import type { CreateShipmentInput, ShipmentSearchParams } from "@/lib/types"

// GET /api/shipments - List shipments with filtering, searching, sorting, pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const params: ShipmentSearchParams = {
      query: searchParams.get("query") || undefined,
      page: Number.parseInt(searchParams.get("page") || "1"),
      limit: Number.parseInt(searchParams.get("limit") || "10"),
      sortBy: (searchParams.get("sortBy") as keyof any) || undefined,
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    }

    // Parse filters
    const filters: any = {}

    const statusFilter = searchParams.get("status")
    if (statusFilter) {
      filters.status = statusFilter.split(",")
    }

    const shippingMethodFilter = searchParams.get("shippingMethod")
    if (shippingMethodFilter) {
      filters.shippingMethod = shippingMethodFilter.split(",")
    }

    const priorityFilter = searchParams.get("priority")
    if (priorityFilter) {
      filters.priority = priorityFilter.split(",")
    }

    const isPriorityFilter = searchParams.get("isPriority")
    if (isPriorityFilter !== null) {
      filters.isPriority = isPriorityFilter === "true"
    }

    const isInsuredFilter = searchParams.get("isInsured")
    if (isInsuredFilter !== null) {
      filters.isInsured = isInsuredFilter === "true"
    }

    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    if (startDate && endDate) {
      filters.dateRange = { start: startDate, end: endDate }
    }

    if (Object.keys(filters).length > 0) {
      params.filters = filters
    }

    const result = getShipments(params)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Error fetching shipments:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch shipments",
      },
      { status: 500 },
    )
  }
}

// POST /api/shipments - Create new shipment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      "trackingNumber",
      "description",
      "senderName",
      "senderAddress",
      "recipientName",
      "recipientAddress",
      "status",
      "shippingMethod",
      "priority",
      "weight",
      "distance",
      "declaredValue",
    ]

    for (const field of requiredFields) {
      if (!body[field] && body[field] !== false && body[field] !== 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 },
        )
      }
    }

    // Validate data types and ranges
    if (typeof body.weight !== "number" || body.weight <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Weight must be a positive number",
        },
        { status: 400 },
      )
    }

    if (typeof body.distance !== "number" || body.distance <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Distance must be a positive number",
        },
        { status: 400 },
      )
    }

    if (typeof body.declaredValue !== "number" || body.declaredValue < 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Declared value must be a non-negative number",
        },
        { status: 400 },
      )
    }

    const shipmentInput: CreateShipmentInput = {
      trackingNumber: body.trackingNumber,
      description: body.description,
      senderName: body.senderName,
      senderAddress: body.senderAddress,
      recipientName: body.recipientName,
      recipientAddress: body.recipientAddress,
      status: body.status,
      shippingMethod: body.shippingMethod,
      priority: body.priority,
      isPriority: Boolean(body.isPriority),
      isInsured: Boolean(body.isInsured),
      requiresSignature: Boolean(body.requiresSignature),
      weight: body.weight,
      distance: body.distance,
      declaredValue: body.declaredValue,
    }

    const newShipment = createShipment(shipmentInput)

    return NextResponse.json(
      {
        success: true,
        data: newShipment,
        message: "Shipment created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating shipment:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create shipment",
      },
      { status: 500 },
    )
  }
}

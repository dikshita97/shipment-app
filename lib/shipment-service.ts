import type { Shipment, ShipmentSearchParams, CreateShipmentInput } from "./types"
import { DEMO_SHIPMENTS } from "./shipment-data"
import { createShipmentWithCalculations } from "./shipment-calculations"

// In-memory storage for demo purposes (simulates database)
const shipmentsStore: Shipment[] = [...DEMO_SHIPMENTS]

/**
 * Get all shipments with optional filtering, searching, sorting, and pagination
 */
export function getShipments(params: ShipmentSearchParams = {}): {
  shipments: Shipment[]
  total: number
  page: number
  totalPages: number
} {
  let filteredShipments = [...shipmentsStore]

  // Apply text search
  if (params.query) {
    const query = params.query.toLowerCase()
    filteredShipments = filteredShipments.filter(
      (shipment) =>
        shipment.trackingNumber.toLowerCase().includes(query) ||
        shipment.description.toLowerCase().includes(query) ||
        shipment.senderName.toLowerCase().includes(query) ||
        shipment.recipientName.toLowerCase().includes(query) ||
        shipment.senderAddress.toLowerCase().includes(query) ||
        shipment.recipientAddress.toLowerCase().includes(query),
    )
  }

  // Apply filters
  if (params.filters) {
    const { status, shippingMethod, priority, isPriority, isInsured, dateRange } = params.filters

    if (status && status.length > 0) {
      filteredShipments = filteredShipments.filter((s) => status.includes(s.status))
    }

    if (shippingMethod && shippingMethod.length > 0) {
      filteredShipments = filteredShipments.filter((s) => shippingMethod.includes(s.shippingMethod))
    }

    if (priority && priority.length > 0) {
      filteredShipments = filteredShipments.filter((s) => priority.includes(s.priority))
    }

    if (isPriority !== undefined) {
      filteredShipments = filteredShipments.filter((s) => s.isPriority === isPriority)
    }

    if (isInsured !== undefined) {
      filteredShipments = filteredShipments.filter((s) => s.isInsured === isInsured)
    }

    if (dateRange) {
      const start = new Date(dateRange.start)
      const end = new Date(dateRange.end)
      filteredShipments = filteredShipments.filter((s) => {
        const createdDate = new Date(s.createdAt)
        return createdDate >= start && createdDate <= end
      })
    }
  }

  // Apply sorting
  if (params.sortBy) {
    const { sortBy, sortOrder = "asc" } = params
    filteredShipments.sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
      return 0
    })
  }

  // Apply pagination
  const page = params.page || 1
  const limit = params.limit || 10
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  const paginatedShipments = filteredShipments.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredShipments.length / limit)

  return {
    shipments: paginatedShipments,
    total: filteredShipments.length,
    page,
    totalPages,
  }
}

/**
 * Get a single shipment by ID
 */
export function getShipmentById(id: string): Shipment | null {
  return shipmentsStore.find((s) => s.id === id) || null
}

/**
 * Create a new shipment
 */
export function createShipment(input: CreateShipmentInput): Shipment {
  const newShipment = createShipmentWithCalculations(input)
  shipmentsStore.push(newShipment)
  return newShipment
}

/**
 * Update an existing shipment
 */
export function updateShipment(id: string, updates: Partial<CreateShipmentInput>): Shipment | null {
  const index = shipmentsStore.findIndex((s) => s.id === id)
  if (index === -1) return null

  const existingShipment = shipmentsStore[index]
  const updatedInput = { ...existingShipment, ...updates }

  // Recalculate fields if relevant data changed
  const updatedShipment = createShipmentWithCalculations(updatedInput, id)
  updatedShipment.createdAt = existingShipment.createdAt // Preserve original creation date

  shipmentsStore[index] = updatedShipment
  return updatedShipment
}

/**
 * Delete a shipment
 */
export function deleteShipment(id: string): boolean {
  const index = shipmentsStore.findIndex((s) => s.id === id)
  if (index === -1) return false

  shipmentsStore.splice(index, 1)
  return true
}

/**
 * Get shipment statistics
 */
export function getShipmentStats() {
  const total = shipmentsStore.length
  const byStatus = shipmentsStore.reduce(
    (acc, shipment) => {
      acc[shipment.status] = (acc[shipment.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const priorityCount = shipmentsStore.filter((s) => s.isPriority).length
  const insuredCount = shipmentsStore.filter((s) => s.isInsured).length

  const totalValue = shipmentsStore.reduce((sum, s) => sum + s.totalCost, 0)

  return {
    total,
    byStatus,
    priorityCount,
    insuredCount,
    totalValue: Math.round(totalValue * 100) / 100,
  }
}

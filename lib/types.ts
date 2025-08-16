// Shipment status enum - required enum field
export type ShipmentStatus =
  | "pending"
  | "confirmed"
  | "picked-up"
  | "in-transit"
  | "out-for-delivery"
  | "delivered"
  | "cancelled"
  | "returned"

// Shipping method enum for calculations
export type ShippingMethod = "standard" | "express" | "overnight" | "same-day"

// Priority levels
export type PriorityLevel = "low" | "medium" | "high" | "urgent"

// Main shipment interface with all required field types
export interface Shipment {
  id: string
  // Text fields - required text field
  trackingNumber: string
  description: string
  senderName: string
  senderAddress: string
  recipientName: string
  recipientAddress: string

  // Enum field - required enum field
  status: ShipmentStatus
  shippingMethod: ShippingMethod
  priority: PriorityLevel

  // Boolean field - required boolean field
  isPriority: boolean
  isInsured: boolean
  requiresSignature: boolean

  // Numeric fields for calculations
  weight: number // in kg
  distance: number // in km
  declaredValue: number // in USD

  // Dates
  createdAt: string
  estimatedDeliveryDate: string
  actualDeliveryDate?: string

  // Calculated field - derived from distance and shipping method
  estimatedDeliveryDays: number

  // Additional calculated fields
  shippingCost: number // calculated from weight, distance, method
  insuranceCost: number // calculated from declared value if insured
  totalCost: number // shipping + insurance
}

// Shipment creation input (without calculated fields)
export interface CreateShipmentInput {
  trackingNumber: string
  description: string
  senderName: string
  senderAddress: string
  recipientName: string
  recipientAddress: string
  status: ShipmentStatus
  shippingMethod: ShippingMethod
  priority: PriorityLevel
  isPriority: boolean
  isInsured: boolean
  requiresSignature: boolean
  weight: number
  distance: number
  declaredValue: number
}

// Filter and search interfaces
export interface ShipmentFilters {
  status?: ShipmentStatus[]
  shippingMethod?: ShippingMethod[]
  priority?: PriorityLevel[]
  isPriority?: boolean
  isInsured?: boolean
  dateRange?: {
    start: string
    end: string
  }
}

export interface ShipmentSearchParams {
  query?: string
  filters?: ShipmentFilters
  sortBy?: keyof Shipment
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

// ShipmentFiltersProps interface for component props
export interface ShipmentFiltersProps {
  filters: ShipmentFilters
  onFiltersChange: (filters: ShipmentFilters) => void
  onClearFilters: () => void
}

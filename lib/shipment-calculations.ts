import type { ShippingMethod, Shipment, CreateShipmentInput } from "./types"

// Base rates for shipping methods (per kg per 100km)
const SHIPPING_RATES = {
  "same-day": 15.0,
  overnight: 8.0,
  express: 5.0,
  standard: 2.5,
} as const

// Delivery time estimates in days based on shipping method and distance
const DELIVERY_TIME_BASE = {
  "same-day": 0.5,
  overnight: 1,
  express: 2,
  standard: 5,
} as const

// Distance multipliers for delivery time calculation
const DISTANCE_MULTIPLIERS = {
  local: 1.0, // 0-50km
  regional: 1.5, // 51-200km
  national: 2.0, // 201-1000km
  international: 3.0, // 1000km+
} as const

/**
 * Calculate estimated delivery days - REQUIRED CALCULATED FIELD
 * Derived from distance and shipping method (≥2 inputs as required)
 */
export function calculateEstimatedDeliveryDays(distance: number, shippingMethod: ShippingMethod): number {
  const baseTime = DELIVERY_TIME_BASE[shippingMethod]

  // Determine distance category
  let multiplier = DISTANCE_MULTIPLIERS.local
  if (distance > 1000) multiplier = DISTANCE_MULTIPLIERS.international
  else if (distance > 200) multiplier = DISTANCE_MULTIPLIERS.national
  else if (distance > 50) multiplier = DISTANCE_MULTIPLIERS.regional

  // Calculate final delivery time
  const estimatedDays = Math.ceil(baseTime * multiplier)

  // Minimum 1 day for same-day if distance is too far
  return Math.max(estimatedDays, shippingMethod === "same-day" ? 1 : estimatedDays)
}

/**
 * Calculate shipping cost based on weight, distance, and method
 */
export function calculateShippingCost(weight: number, distance: number, shippingMethod: ShippingMethod): number {
  const rate = SHIPPING_RATES[shippingMethod]
  const distanceUnits = Math.ceil(distance / 100) // per 100km units
  const baseCost = weight * rate * distanceUnits

  // Minimum charge
  const minimumCharge =
    shippingMethod === "same-day" ? 25 : shippingMethod === "overnight" ? 15 : shippingMethod === "express" ? 10 : 5

  return Math.max(baseCost, minimumCharge)
}

/**
 * Calculate insurance cost (2% of declared value if insured)
 */
export function calculateInsuranceCost(declaredValue: number, isInsured: boolean): number {
  return isInsured ? Math.max(declaredValue * 0.02, 5) : 0
}

/**
 * Calculate total cost (shipping + insurance)
 */
export function calculateTotalCost(shippingCost: number, insuranceCost: number): number {
  return shippingCost + insuranceCost
}

/**
 * Generate estimated delivery date based on current date and estimated days
 */
export function calculateEstimatedDeliveryDate(estimatedDays: number): string {
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + estimatedDays)
  return deliveryDate.toISOString()
}

/**
 * Create a complete shipment with all calculated fields
 */
export function createShipmentWithCalculations(input: CreateShipmentInput, id?: string): Shipment {
  // Calculate all derived fields
  const estimatedDeliveryDays = calculateEstimatedDeliveryDays(input.distance, input.shippingMethod)

  const shippingCost = calculateShippingCost(input.weight, input.distance, input.shippingMethod)

  const insuranceCost = calculateInsuranceCost(input.declaredValue, input.isInsured)

  const totalCost = calculateTotalCost(shippingCost, insuranceCost)

  const estimatedDeliveryDate = calculateEstimatedDeliveryDate(estimatedDeliveryDays)

  return {
    ...input,
    id: id || `SHP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    estimatedDeliveryDate,
    estimatedDeliveryDays,
    shippingCost: Math.round(shippingCost * 100) / 100, // Round to 2 decimals
    insuranceCost: Math.round(insuranceCost * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
  }
}

import type { Shipment, CreateShipmentInput, ShipmentSearchParams } from "./types"

// API response types
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface ShipmentsResponse {
  shipments: Shipment[]
  total: number
  page: number
  totalPages: number
}

interface ShipmentStats {
  total: number
  byStatus: Record<string, number>
  priorityCount: number
  insuredCount: number
  totalValue: number
}

// Base API client class
class ApiClient {
  private baseUrl = "/api"

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Get shipments with optional parameters
  async getShipments(params: ShipmentSearchParams = {}): Promise<ShipmentsResponse> {
    const searchParams = new URLSearchParams()

    if (params.query) searchParams.set("query", params.query)
    if (params.page) searchParams.set("page", params.page.toString())
    if (params.limit) searchParams.set("limit", params.limit.toString())
    if (params.sortBy) searchParams.set("sortBy", params.sortBy)
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder)

    // Add filters
    if (params.filters) {
      const { status, shippingMethod, priority, isPriority, isInsured, dateRange } = params.filters

      if (status && status.length > 0) {
        searchParams.set("status", status.join(","))
      }
      if (shippingMethod && shippingMethod.length > 0) {
        searchParams.set("shippingMethod", shippingMethod.join(","))
      }
      if (priority && priority.length > 0) {
        searchParams.set("priority", priority.join(","))
      }
      if (isPriority !== undefined) {
        searchParams.set("isPriority", isPriority.toString())
      }
      if (isInsured !== undefined) {
        searchParams.set("isInsured", isInsured.toString())
      }
      if (dateRange) {
        searchParams.set("startDate", dateRange.start)
        searchParams.set("endDate", dateRange.end)
      }
    }

    const queryString = searchParams.toString()
    const endpoint = `/shipments${queryString ? `?${queryString}` : ""}`

    const response = await this.request<ShipmentsResponse>(endpoint)
    return response.data!
  }

  // Get single shipment by ID
  async getShipment(id: string): Promise<Shipment> {
    const response = await this.request<Shipment>(`/shipments/${id}`)
    return response.data!
  }

  // Create new shipment
  async createShipment(shipment: CreateShipmentInput): Promise<Shipment> {
    const response = await this.request<Shipment>("/shipments", {
      method: "POST",
      body: JSON.stringify(shipment),
    })
    return response.data!
  }

  // Update existing shipment
  async updateShipment(id: string, updates: Partial<CreateShipmentInput>): Promise<Shipment> {
    const response = await this.request<Shipment>(`/shipments/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
    return response.data!
  }

  // Delete shipment
  async deleteShipment(id: string): Promise<void> {
    await this.request(`/shipments/${id}`, {
      method: "DELETE",
    })
  }

  // Get shipment statistics
  async getShipmentStats(): Promise<ShipmentStats> {
    const response = await this.request<ShipmentStats>("/shipments/stats")
    return response.data!
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export types for use in components
export type { ShipmentsResponse, ShipmentStats }

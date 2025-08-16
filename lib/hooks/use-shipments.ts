"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import type { Shipment, ShipmentSearchParams } from "@/lib/types"
import type { ShipmentsResponse } from "@/lib/api-client"

export function useShipments(params: ShipmentSearchParams = {}) {
  const [data, setData] = useState<ShipmentsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchShipments = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.getShipments(params)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch shipments")
    } finally {
      setLoading(false)
    }
  }

  const optimisticDelete = (shipmentId: string) => {
    if (data) {
      const updatedShipments = data.shipments.filter((s) => s.id !== shipmentId)
      setData({
        ...data,
        shipments: updatedShipments,
        total: data.total - 1,
        totalPages: Math.ceil((data.total - 1) / (params.limit || 10)),
      })
    }
  }

  useEffect(() => {
    fetchShipments()
  }, [JSON.stringify(params)]) // Re-fetch when params change

  return {
    data,
    loading,
    error,
    refetch: fetchShipments,
    optimisticDelete, // Expose optimistic delete function
  }
}

export function useShipment(id: string) {
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiClient.getShipment(id)
        setShipment(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch shipment")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchShipment()
    }
  }, [id])

  return {
    shipment,
    loading,
    error,
  }
}

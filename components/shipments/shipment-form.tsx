"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { apiClient } from "@/lib/api-client"
import type { CreateShipmentInput, Shipment } from "@/lib/types"

interface ShipmentFormProps {
  shipment?: Shipment
  onSuccess?: (shipment: Shipment) => void
  onCancel?: () => void
}

export function ShipmentForm({ shipment, onSuccess, onCancel }: ShipmentFormProps) {
  const [formData, setFormData] = useState<CreateShipmentInput>({
    trackingNumber: shipment?.trackingNumber || "",
    description: shipment?.description || "",
    senderName: shipment?.senderName || "",
    senderAddress: shipment?.senderAddress || "",
    recipientName: shipment?.recipientName || "",
    recipientAddress: shipment?.recipientAddress || "",
    status: shipment?.status || "pending",
    shippingMethod: shipment?.shippingMethod || "standard",
    priority: shipment?.priority || "medium",
    isPriority: shipment?.isPriority || false,
    isInsured: shipment?.isInsured || false,
    requiresSignature: shipment?.requiresSignature || false,
    weight: shipment?.weight || 0,
    distance: shipment?.distance || 0,
    declaredValue: shipment?.declaredValue || 0,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let result: Shipment
      if (shipment) {
        result = await apiClient.updateShipment(shipment.id, formData)
      } else {
        result = await apiClient.createShipment(formData)
      }
      onSuccess?.(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save shipment")
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: keyof CreateShipmentInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{shipment ? "Edit Shipment" : "Create New Shipment"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="trackingNumber">Tracking Number</Label>
                <Input
                  id="trackingNumber"
                  value={formData.trackingNumber}
                  onChange={(e) => updateField("trackingNumber", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => updateField("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="picked-up">Picked Up</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Sender Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Sender Information</h3>
            <div className="space-y-2">
              <Label htmlFor="senderName">Sender Name</Label>
              <Input
                id="senderName"
                value={formData.senderName}
                onChange={(e) => updateField("senderName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderAddress">Sender Address</Label>
              <Textarea
                id="senderAddress"
                value={formData.senderAddress}
                onChange={(e) => updateField("senderAddress", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Recipient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recipient Information</h3>
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) => updateField("recipientName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientAddress">Recipient Address</Label>
              <Textarea
                id="recipientAddress"
                value={formData.recipientAddress}
                onChange={(e) => updateField("recipientAddress", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Shipping Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Shipping Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="shippingMethod">Shipping Method</Label>
                <Select value={formData.shippingMethod} onValueChange={(value) => updateField("shippingMethod", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="same-day">Same Day</SelectItem>
                    <SelectItem value="overnight">Overnight</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={formData.priority} onValueChange={(value) => updateField("priority", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.weight}
                  onChange={(e) => updateField("weight", Number.parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  min="0"
                  value={formData.distance}
                  onChange={(e) => updateField("distance", Number.parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="declaredValue">Declared Value ($)</Label>
                <Input
                  id="declaredValue"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.declaredValue}
                  onChange={(e) => updateField("declaredValue", Number.parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Options</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPriority"
                  checked={formData.isPriority}
                  onCheckedChange={(checked) => updateField("isPriority", checked)}
                />
                <Label htmlFor="isPriority">Mark as Priority Shipment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isInsured"
                  checked={formData.isInsured}
                  onCheckedChange={(checked) => updateField("isInsured", checked)}
                />
                <Label htmlFor="isInsured">Add Insurance Coverage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresSignature"
                  checked={formData.requiresSignature}
                  onCheckedChange={(checked) => updateField("requiresSignature", checked)}
                />
                <Label htmlFor="requiresSignature">Requires Signature on Delivery</Label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : shipment ? "Update Shipment" : "Create Shipment"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

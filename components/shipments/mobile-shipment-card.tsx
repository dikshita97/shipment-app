"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import StatusBadge from "./status-badge"
import PriorityBadge from "./priority-badge"
import { Calendar, Package, MapPin, DollarSign, Truck } from "lucide-react"
import type { Shipment } from "@/lib/types"

interface MobileShipmentCardProps {
  shipment: Shipment
  onSelect?: (shipment: Shipment) => void
  onEdit?: (shipment: Shipment) => void
  onDelete?: (shipment: Shipment) => Promise<void>
}

export function MobileShipmentCard({ shipment, onSelect, onEdit, onDelete }: MobileShipmentCardProps) {
  const handleDelete = async () => {
    if (onDelete) {
      try {
        await onDelete(shipment)
      } catch (error) {
        // Error handling is done in the parent component
        console.error("Delete failed:", error)
      }
    }
  }

  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="font-semibold text-sm">{shipment.trackingNumber}</div>
            <div className="text-xs text-muted-foreground line-clamp-2">{shipment.description}</div>
          </div>
          <StatusBadge status={shipment.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Priority and Shipping Method */}
        <div className="flex items-center justify-between">
          <PriorityBadge priority={shipment.priority} isPriority={shipment.isPriority} />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Truck className="h-3 w-3" />
            <span className="capitalize">{shipment.shippingMethod.replace("-", " ")}</span>
          </div>
        </div>

        {/* Addresses */}
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div>
              <div className="font-medium">{shipment.senderName}</div>
              <div className="text-muted-foreground line-clamp-1">{shipment.senderAddress}</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Package className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div>
              <div className="font-medium">{shipment.recipientName}</div>
              <div className="text-muted-foreground line-clamp-1">{shipment.recipientAddress}</div>
            </div>
          </div>
        </div>

        {/* Delivery and Cost Info */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{shipment.estimatedDeliveryDays} days</span>
          </div>
          <div className="flex items-center gap-1 font-semibold">
            <DollarSign className="h-3 w-3" />
            <span>{shipment.totalCost.toFixed(2)}</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex gap-1">
          {shipment.isInsured && (
            <Badge variant="outline" className="text-xs">
              Insured
            </Badge>
          )}
          {shipment.requiresSignature && (
            <Badge variant="outline" className="text-xs">
              Signature Required
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onSelect?.(shipment)}>
            View
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onEdit?.(shipment)}>
            Edit
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

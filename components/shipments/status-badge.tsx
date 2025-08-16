import { Badge } from "@/components/ui/badge"
import type { ShipmentStatus } from "@/lib/types"

interface StatusBadgeProps {
  status: ShipmentStatus
}

const statusConfig = {
  pending: { label: "Pending", variant: "outline" as const, color: "text-yellow-600 border-yellow-200 bg-yellow-50" },
  confirmed: { label: "Confirmed", variant: "outline" as const, color: "text-blue-600 border-blue-200 bg-blue-50" },
  "picked-up": {
    label: "Picked Up",
    variant: "outline" as const,
    color: "text-purple-600 border-purple-200 bg-purple-50",
  },
  "in-transit": {
    label: "In Transit",
    variant: "outline" as const,
    color: "text-orange-600 border-orange-200 bg-orange-50",
  },
  "out-for-delivery": {
    label: "Out for Delivery",
    variant: "outline" as const,
    color: "text-indigo-600 border-indigo-200 bg-indigo-50",
  },
  delivered: { label: "Delivered", variant: "outline" as const, color: "text-green-600 border-green-200 bg-green-50" },
  cancelled: { label: "Cancelled", variant: "outline" as const, color: "text-red-600 border-red-200 bg-red-50" },
  returned: { label: "Returned", variant: "outline" as const, color: "text-gray-600 border-gray-200 bg-gray-50" },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={config.color}>
      {config.label}
    </Badge>
  )
}

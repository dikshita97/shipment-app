import { Badge } from "@/components/ui/badge"
import type { PriorityLevel } from "@/lib/types"

interface PriorityBadgeProps {
  priority: PriorityLevel
  isPriority: boolean
}

const priorityConfig = {
  low: { label: "Low", color: "text-gray-600 border-gray-200 bg-gray-50" },
  medium: { label: "Medium", color: "text-blue-600 border-blue-200 bg-blue-50" },
  high: { label: "High", color: "text-orange-600 border-orange-200 bg-orange-50" },
  urgent: { label: "Urgent", color: "text-red-600 border-red-200 bg-red-50" },
}

export default function PriorityBadge({ priority, isPriority }: PriorityBadgeProps) {
  const config = priorityConfig[priority]

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
      {isPriority && (
        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
          Priority
        </Badge>
      )}
    </div>
  )
}

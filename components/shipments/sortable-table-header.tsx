"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import type { Shipment } from "@/lib/types"

interface SortableTableHeaderProps {
  column: keyof Shipment
  label: string
  sortBy?: keyof Shipment
  sortOrder?: "asc" | "desc"
  onSort: (column: keyof Shipment) => void
}

export function SortableTableHeader({ column, label, sortBy, sortOrder, onSort }: SortableTableHeaderProps) {
  const isActive = sortBy === column

  const getSortIcon = () => {
    if (!isActive) return <ArrowUpDown className="h-4 w-4" />
    return sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  return (
    <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent" onClick={() => onSort(column)}>
      <span className="flex items-center gap-2">
        {label}
        {getSortIcon()}
      </span>
    </Button>
  )
}

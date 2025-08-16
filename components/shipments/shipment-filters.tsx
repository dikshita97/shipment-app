"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { ShipmentFilters as FilterType, ShipmentStatus, ShippingMethod, PriorityLevel } from "@/lib/types"

interface ShipmentFiltersProps {
  filters: FilterType
  onFiltersChange: (filters: FilterType) => void
  onClearFilters: () => void
}

const statusOptions: { value: ShipmentStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "picked-up", label: "Picked Up" },
  { value: "in-transit", label: "In Transit" },
  { value: "out-for-delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
]

const shippingMethodOptions: { value: ShippingMethod; label: string }[] = [
  { value: "same-day", label: "Same Day" },
  { value: "overnight", label: "Overnight" },
  { value: "express", label: "Express" },
  { value: "standard", label: "Standard" },
]

const priorityOptions: { value: PriorityLevel; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
]

export function ShipmentFilters({ filters, onFiltersChange, onClearFilters }: ShipmentFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = <K extends keyof FilterType>(key: K, value: FilterType[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = <T extends string>(key: keyof FilterType, value: T, currentArray: T[] | undefined) => {
    const array = currentArray || []
    const newArray = array.includes(value) ? array.filter((item) => item !== value) : [...array, value]
    updateFilter(key, newArray.length > 0 ? newArray : undefined)
  }

  const hasActiveFilters = Object.values(filters).some((value) => {
    if (Array.isArray(value)) return value.length > 0
    return value !== undefined
  })

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.status && filters.status.length > 0) count++
    if (filters.shippingMethod && filters.shippingMethod.length > 0) count++
    if (filters.priority && filters.priority.length > 0) count++
    if (filters.isPriority !== undefined) count++
    if (filters.isInsured !== undefined) count++
    if (filters.dateRange) count++
    return count
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                {getActiveFilterCount()} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClearFilters} disabled={!hasActiveFilters}>
              Clear All
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Status Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Status</Label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${option.value}`}
                    checked={filters.status?.includes(option.value) || false}
                    onCheckedChange={() => toggleArrayFilter("status", option.value, filters.status)}
                  />
                  <Label htmlFor={`status-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Method Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Shipping Method</Label>
            <div className="flex flex-wrap gap-2">
              {shippingMethodOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`method-${option.value}`}
                    checked={filters.shippingMethod?.includes(option.value) || false}
                    onCheckedChange={() => toggleArrayFilter("shippingMethod", option.value, filters.shippingMethod)}
                  />
                  <Label htmlFor={`method-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Priority Level</Label>
            <div className="flex flex-wrap gap-2">
              {priorityOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`priority-${option.value}`}
                    checked={filters.priority?.includes(option.value) || false}
                    onCheckedChange={() => toggleArrayFilter("priority", option.value, filters.priority)}
                  />
                  <Label htmlFor={`priority-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Boolean Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPriority"
                  checked={filters.isPriority === true}
                  onCheckedChange={(checked) => updateFilter("isPriority", checked ? true : undefined)}
                />
                <Label htmlFor="isPriority" className="text-sm">
                  Priority Shipments Only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isInsured"
                  checked={filters.isInsured === true}
                  onCheckedChange={(checked) => updateFilter("isInsured", checked ? true : undefined)}
                />
                <Label htmlFor="isInsured" className="text-sm">
                  Insured Shipments Only
                </Label>
              </div>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Date Range</Label>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="startDate" className="text-xs text-muted-foreground">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.dateRange?.start || ""}
                  onChange={(e) =>
                    updateFilter("dateRange", {
                      start: e.target.value,
                      end: filters.dateRange?.end || "",
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="endDate" className="text-xs text-muted-foreground">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.dateRange?.end || ""}
                  onChange={(e) =>
                    updateFilter("dateRange", {
                      start: filters.dateRange?.start || "",
                      end: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Search, Save } from "lucide-react"

interface SearchCriteria {
  field: string
  operator: string
  value: string
}

interface AdvancedSearchProps {
  onSearch: (criteria: SearchCriteria[]) => void
  onClear: () => void
}

const searchFields = [
  { value: "trackingNumber", label: "Tracking Number" },
  { value: "description", label: "Description" },
  { value: "senderName", label: "Sender Name" },
  { value: "recipientName", label: "Recipient Name" },
  { value: "senderAddress", label: "Sender Address" },
  { value: "recipientAddress", label: "Recipient Address" },
  { value: "status", label: "Status" },
  { value: "shippingMethod", label: "Shipping Method" },
  { value: "priority", label: "Priority" },
  { value: "weight", label: "Weight" },
  { value: "distance", label: "Distance" },
  { value: "declaredValue", label: "Declared Value" },
  { value: "totalCost", label: "Total Cost" },
]

const operators = [
  { value: "contains", label: "Contains" },
  { value: "equals", label: "Equals" },
  { value: "startsWith", label: "Starts With" },
  { value: "endsWith", label: "Ends With" },
  { value: "greaterThan", label: "Greater Than" },
  { value: "lessThan", label: "Less Than" },
  { value: "greaterThanOrEqual", label: "Greater Than or Equal" },
  { value: "lessThanOrEqual", label: "Less Than or Equal" },
]

export function AdvancedSearch({ onSearch, onClear }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [criteria, setCriteria] = useState<SearchCriteria[]>([])
  const [savedSearches, setSavedSearches] = useState<{ name: string; criteria: SearchCriteria[] }[]>([])

  const addCriteria = () => {
    setCriteria([...criteria, { field: "trackingNumber", operator: "contains", value: "" }])
  }

  const updateCriteria = (index: number, field: keyof SearchCriteria, value: string) => {
    const newCriteria = [...criteria]
    newCriteria[index] = { ...newCriteria[index], [field]: value }
    setCriteria(newCriteria)
  }

  const removeCriteria = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index))
  }

  const handleSearch = () => {
    const validCriteria = criteria.filter((c) => c.value.trim() !== "")
    onSearch(validCriteria)
  }

  const handleClear = () => {
    setCriteria([])
    onClear()
  }

  const saveSearch = () => {
    const name = prompt("Enter a name for this search:")
    if (name && criteria.length > 0) {
      setSavedSearches([...savedSearches, { name, criteria: [...criteria] }])
    }
  }

  const loadSavedSearch = (savedCriteria: SearchCriteria[]) => {
    setCriteria(savedCriteria)
    onSearch(savedCriteria)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search
            {criteria.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {criteria.length} {criteria.length === 1 ? "criterion" : "criteria"}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Saved Searches */}
          {savedSearches.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Saved Searches</Label>
              <div className="flex flex-wrap gap-2">
                {savedSearches.map((saved, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadSavedSearch(saved.criteria)}
                    className="text-xs"
                  >
                    {saved.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Search Criteria */}
          <div className="space-y-3">
            {criteria.map((criterion, index) => (
              <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                <Select value={criterion.field} onValueChange={(value) => updateCriteria(index, "field", value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {searchFields.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={criterion.operator} onValueChange={(value) => updateCriteria(index, "operator", value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Enter value..."
                  value={criterion.value}
                  onChange={(e) => updateCriteria(index, "value", e.target.value)}
                  className="flex-1"
                />

                <Button variant="outline" size="sm" onClick={() => removeCriteria(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <Button onClick={addCriteria} variant="outline" size="sm">
              Add Criteria
            </Button>
            <Button onClick={handleSearch} size="sm" disabled={criteria.length === 0}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button onClick={handleClear} variant="outline" size="sm">
              Clear All
            </Button>
            {criteria.length > 0 && (
              <Button onClick={saveSearch} variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Search
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

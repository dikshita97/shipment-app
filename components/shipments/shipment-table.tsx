"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import StatusBadge from "./status-badge"
import PriorityBadge from "./priority-badge"
import { MobileShipmentCard } from "./mobile-shipment-card"
import { ShipmentFilters } from "./shipment-filters"
import { PaginationControls } from "./pagination-controls"
import { SortableTableHeader } from "./sortable-table-header"
import { AdvancedSearch } from "./advanced-search"
import { SearchSuggestions } from "./search-suggestions"
import { useShipments } from "@/lib/hooks/use-shipments"
import { Search, Filter, Grid, List } from "lucide-react"
import type { Shipment, ShipmentFilters as FilterType, ShipmentSearchParams } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface ShipmentTableProps {
  onSelectShipment?: (shipment: Shipment) => void
  onEditShipment?: (shipment: Shipment) => void
  onDeleteShipment?: (shipment: Shipment) => Promise<void>
}

export function ShipmentTable({ onSelectShipment, onEditShipment, onDeleteShipment }: ShipmentTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterType>({})
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [sortBy, setSortBy] = useState<keyof Shipment>("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [showFilters, setShowFilters] = useState(false)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
      setPage(1) // Reset to first page when searching

      // Save to recent searches if query is not empty
      if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
        const newRecentSearches = [searchQuery.trim(), ...recentSearches.slice(0, 9)]
        setRecentSearches(newRecentSearches)
        localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches))
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, recentSearches])

  const searchParams: ShipmentSearchParams = {
    query: debouncedQuery || undefined,
    filters: Object.keys(filters).length > 0 ? filters : undefined,
    page,
    limit: itemsPerPage,
    sortBy,
    sortOrder,
  }

  const { data, loading, error, refetch, optimisticDelete } = useShipments(searchParams)

  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearchQuery("")
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setPage(1) // Reset to first page when changing items per page
  }

  const handleSort = (column: keyof Shipment) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
    setPage(1) // Reset to first page when sorting
  }

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
  }

  const handleAdvancedSearch = (criteria: any[]) => {
    // Convert advanced search criteria to simple query for now
    // In a real app, this would be handled by the backend
    const queryParts = criteria.map((c) => c.value).join(" ")
    setSearchQuery(queryParts)
    setShowSuggestions(false)
  }

  const handleDelete = async (shipment: Shipment) => {
    if (onDeleteShipment) {
      try {
        // Optimistically remove from UI immediately
        optimisticDelete(shipment.id)
        // Call the parent's delete handler
        await onDeleteShipment(shipment)
      } catch (error) {
        // If delete fails, refetch to restore correct state
        console.error("Delete failed, refreshing data:", error)
        refetch()
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <LoadingSpinner size="lg" />
              <div className="text-muted-foreground">Loading shipments...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="text-destructive text-center">
                <div className="font-medium">Error loading shipments</div>
                <div className="text-sm mt-1">{error}</div>
              </div>
              <Button onClick={refetch} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Shipments
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <div className="hidden sm:flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Input
              placeholder="Search by tracking number, description, sender, recipient, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {showSuggestions && (
              <SearchSuggestions
                query={searchQuery}
                onSelectSuggestion={handleSelectSuggestion}
                recentSearches={recentSearches}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <AdvancedSearch onSearch={handleAdvancedSearch} onClear={handleClearFilters} />

      {showFilters && (
        <ShipmentFilters filters={filters} onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Shipments {data && `(${data.total} ${data.total === 1 ? "result" : "results"})`}</CardTitle>
        </CardHeader>
        <CardContent>
          {!data || data.shipments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="text-muted-foreground text-center">
                {debouncedQuery || Object.keys(filters).length > 0
                  ? "No shipments match your criteria"
                  : "No shipments found"}
              </div>
              {(debouncedQuery || Object.keys(filters).length > 0) && (
                <Button onClick={handleClearFilters} variant="outline">
                  Clear Search & Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="block sm:hidden">
                <div className="space-y-4">
                  {data.shipments.map((shipment) => (
                    <MobileShipmentCard
                      key={shipment.id}
                      shipment={shipment}
                      onSelect={onSelectShipment}
                      onEdit={onEditShipment}
                      onDelete={onDeleteShipment}
                    />
                  ))}
                </div>
              </div>

              <div className="hidden sm:block">
                {viewMode === "cards" ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {data.shipments.map((shipment) => (
                      <MobileShipmentCard
                        key={shipment.id}
                        shipment={shipment}
                        onSelect={onSelectShipment}
                        onEdit={onEditShipment}
                        onDelete={onDeleteShipment}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[140px]">
                            <SortableTableHeader
                              column="trackingNumber"
                              label="Tracking Number"
                              sortBy={sortBy}
                              sortOrder={sortOrder}
                              onSort={handleSort}
                            />
                          </TableHead>
                          <TableHead className="min-w-[200px]">
                            <SortableTableHeader
                              column="description"
                              label="Description"
                              sortBy={sortBy}
                              sortOrder={sortOrder}
                              onSort={handleSort}
                            />
                          </TableHead>
                          <TableHead className="min-w-[120px]">
                            <SortableTableHeader
                              column="status"
                              label="Status"
                              sortBy={sortBy}
                              sortOrder={sortOrder}
                              onSort={handleSort}
                            />
                          </TableHead>
                          <TableHead className="min-w-[120px]">
                            <SortableTableHeader
                              column="priority"
                              label="Priority"
                              sortBy={sortBy}
                              sortOrder={sortOrder}
                              onSort={handleSort}
                            />
                          </TableHead>
                          <TableHead className="min-w-[140px]">
                            <SortableTableHeader
                              column="shippingMethod"
                              label="Shipping Method"
                              sortBy={sortBy}
                              sortOrder={sortOrder}
                              onSort={handleSort}
                            />
                          </TableHead>
                          <TableHead className="min-w-[100px]">
                            <SortableTableHeader
                              column="isPriority"
                              label="Priority Flag"
                              sortBy={sortBy}
                              sortOrder={sortOrder}
                              onSort={handleSort}
                            />
                          </TableHead>
                          <TableHead className="min-w-[100px]">
                            <SortableTableHeader
                              column="isInsured"
                              label="Insured"
                              sortBy={sortBy}
                              sortOrder={sortOrder}
                              onSort={handleSort}
                            />
                          </TableHead>
                          <TableHead className="min-w-[120px]">
                            <SortableTableHeader
                              column="requiresSignature"
                              label="Signature Req."
                              sortBy={sortBy}
                              sortOrder={sortOrder}
                              onSort={handleSort}
                            />
                          </TableHead>
                          <TableHead className="min-w-[160px]">
                            <SortableTableHeader
                              column="estimatedDeliveryDate"
                              label="Estimated Delivery"
                              sortBy={sortBy}
                              sortOrder={sortOrder}
                              onSort={handleSort}
                            />
                          </TableHead>
                          <TableHead className="min-w-[100px]">
                            <SortableTableHeader
                              column="shippingCost"
                              label="Shipping Cost"
                              sortBy={sortBy}
                              sortOrder={sortOrder}
                              onSort={handleSort}
                            />
                          </TableHead>
                          <TableHead className="min-w-[100px]">
                            <SortableTableHeader
                              column="insuranceCost"
                              label="Insurance Cost"
                              sortBy={sortBy}
                              sortOrder={sortOrder}
                              onSort={handleSort}
                            />
                          </TableHead>
                          <TableHead className="min-w-[100px]">
                            <SortableTableHeader
                              column="totalCost"
                              label="Total Cost"
                              sortBy={sortBy}
                              sortOrder={sortOrder}
                              onSort={handleSort}
                            />
                          </TableHead>
                          <TableHead className="min-w-[200px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.shipments.map((shipment) => (
                          <TableRow key={shipment.id} className="hover:bg-muted/50 transition-colors">
                            <TableCell className="font-medium">{shipment.trackingNumber}</TableCell>
                            <TableCell className="max-w-xs truncate">{shipment.description}</TableCell>
                            <TableCell>
                              <StatusBadge status={shipment.status} />
                            </TableCell>
                            <TableCell>
                              <PriorityBadge priority={shipment.priority} isPriority={shipment.isPriority} />
                            </TableCell>
                            <TableCell className="capitalize">{shipment.shippingMethod.replace("-", " ")}</TableCell>
                            <TableCell>
                              <Badge variant={shipment.isPriority ? "default" : "outline"} className="text-xs">
                                {shipment.isPriority ? "Yes" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={shipment.isInsured ? "default" : "outline"} className="text-xs">
                                {shipment.isInsured ? "Yes" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={shipment.requiresSignature ? "default" : "outline"} className="text-xs">
                                {shipment.requiresSignature ? "Yes" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{new Date(shipment.estimatedDeliveryDate).toLocaleDateString()}</div>
                                <div className="text-muted-foreground">{shipment.estimatedDeliveryDays} days</div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">${shipment.shippingCost.toFixed(2)}</TableCell>
                            <TableCell className="font-medium">${shipment.insuranceCost.toFixed(2)}</TableCell>
                            <TableCell className="font-medium">${shipment.totalCost.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => onSelectShipment?.(shipment)}>
                                  View
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => onEditShipment?.(shipment)}>
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDelete(shipment)}>
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              <PaginationControls
                currentPage={page}
                totalPages={data.totalPages}
                totalItems={data.total}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

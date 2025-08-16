"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { getCurrentUser, logout } from "@/lib/auth"
import { ShipmentStatsCards } from "@/components/shipments/shipment-stats"
import { ShipmentTable } from "@/components/shipments/shipment-table"
import { ShipmentForm } from "@/components/shipments/shipment-form"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Package, Plus, BarChart3, Menu, X, Home, Settings, LogOut, Truck } from "lucide-react"
import StatusBadge from "@/components/shipments/status-badge" // Import StatusBadge
import PriorityBadge from "@/components/shipments/priority-badge" // Import PriorityBadge
import { apiClient } from "@/lib/api-client" // Added apiClient import for delete functionality
import type { User } from "@/lib/auth"
import type { Shipment } from "@/lib/types"

type ViewMode = "dashboard" | "create" | "edit" | "view" | "settings"

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard")
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }

  const handleLogout = () => {
    logout()
    setUser(null)
    setViewMode("dashboard")
    setIsMobileMenuOpen(false)
  }

  const handleSelectShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setViewMode("view")
    setIsMobileMenuOpen(false)
  }

  const handleEditShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setViewMode("edit")
    setIsMobileMenuOpen(false)
  }

  const handleDeleteShipment = async (shipment: Shipment) => {
    if (confirm(`Are you sure you want to delete shipment ${shipment.trackingNumber}?`)) {
      try {
        await apiClient.deleteShipment(shipment.id)
        console.log("[v0] Successfully deleted shipment:", shipment.id)
        // No need to manually refetch - the table handles optimistic updates
      } catch (error) {
        console.error("Failed to delete shipment:", error)
        alert("Failed to delete shipment. Please try again.")
        throw error // Re-throw so table can handle the error
      }
    } else {
      throw new Error("Delete cancelled") // Throw error if user cancels to trigger refetch
    }
  }

  const handleFormSuccess = () => {
    setViewMode("dashboard")
    setSelectedShipment(null)
  }

  const handleFormCancel = () => {
    setViewMode("dashboard")
    setSelectedShipment(null)
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, mode: "dashboard" as ViewMode },
    { id: "create", label: "Create Shipment", icon: Plus, mode: "create" as ViewMode },
    { id: "settings", label: "Settings", icon: Settings, mode: "settings" as ViewMode }, // New navigation item
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <div className="text-lg text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Truck className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-primary">ShipTrack Pro</h1>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant={viewMode === item.mode ? "default" : "ghost"}
                      onClick={() => setViewMode(item.mode)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  )
                })}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium">{user.username}</div>
                  <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">Logout</span>
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant={viewMode === item.mode ? "default" : "ghost"}
                      onClick={() => {
                        setViewMode(item.mode)
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full justify-start flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  )
                })}
                <div className="pt-2 border-t">
                  <div className="px-3 py-2 text-sm">
                    <div className="font-medium">{user.username}</div>
                    <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start flex items-center gap-2 text-destructive hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 lg:py-8">
        {viewMode === "dashboard" && (
          <div className="space-y-6 lg:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-2">Shipment Dashboard</h2>
                <p className="text-muted-foreground">Manage and track your shipments efficiently</p>
              </div>
              <Button onClick={() => setViewMode("create")} className="flex items-center gap-2 sm:w-auto">
                <Plus className="h-4 w-4" />
                Create Shipment
              </Button>
            </div>

            <ShipmentStatsCards />

            <ShipmentTable
              onSelectShipment={handleSelectShipment}
              onEditShipment={handleEditShipment}
              onDeleteShipment={handleDeleteShipment}
            />
          </div>
        )}

        {viewMode === "create" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Create New Shipment</h2>
              <p className="text-muted-foreground">Fill in the details to create a new shipment</p>
            </div>
            <ShipmentForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
          </div>
        )}

        {viewMode === "edit" && selectedShipment && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Edit Shipment</h2>
              <p className="text-muted-foreground">Update shipment details for {selectedShipment.trackingNumber}</p>
            </div>
            <ShipmentForm shipment={selectedShipment} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
          </div>
        )}

        {viewMode === "view" && selectedShipment && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Shipment Details</h2>
              <p className="text-muted-foreground">Viewing details for {selectedShipment.trackingNumber}</p>
            </div>
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Basic Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tracking:</span>
                        <span className="font-medium">{selectedShipment.trackingNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Description:</span>
                        <span className="font-medium">{selectedShipment.description}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <StatusBadge status={selectedShipment.status} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Shipping Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Method:</span>
                        <span className="font-medium capitalize">
                          {selectedShipment.shippingMethod.replace("-", " ")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Priority:</span>
                        <PriorityBadge priority={selectedShipment.priority} isPriority={selectedShipment.isPriority} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimated Delivery:</span>
                        <span className="font-medium">{selectedShipment.estimatedDeliveryDays} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Cost:</span>
                        <span className="font-medium">${selectedShipment.totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button onClick={() => setViewMode("dashboard")} variant="outline" className="flex-1 sm:flex-none">
                  Back to Dashboard
                </Button>
                <Button onClick={() => handleEditShipment(selectedShipment)} className="flex-1 sm:flex-none">
                  Edit Shipment
                </Button>
              </div>
            </div>
          </div>
        )}

        {viewMode === "settings" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Settings</h2>
              <p className="text-muted-foreground">Manage your account settings</p>
            </div>
            {/* Settings content goes here */}
          </div>
        )}
      </main>
    </div>
  )
}

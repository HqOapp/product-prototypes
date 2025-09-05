"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Building2, 
  Users, 
  Square, 
  Calendar, 
  DollarSign, 
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  ArrowUpDown,
  Maximize,
  X
} from "lucide-react"

interface Tenant {
  id: string
  name: string
  logo?: string
  industry: string
  rsf: number
  leaseStart: string
  leaseEnd: string
  monthlyRent: number
  status: 'active' | 'expiring-soon' | 'vacant'
  contactName: string
  suite: string
}

interface Floor {
  number: number
  totalRsf: number
  availableRsf: number
  tenants: Tenant[]
  occupancyRate: number
}

interface StackingPlanTabProps {
  buildingData: any
}

export function StackingPlanTab({ buildingData }: StackingPlanTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Generate mock floor and tenant data for Cobblestone Collaborative
  const generateFloorData = (): Floor[] => {
    const floors: Floor[] = []
    const totalFloors = buildingData?.floors || 12
    const totalRsf = buildingData?.square_foot || 450000
    const avgFloorRsf = Math.floor(totalRsf / totalFloors)

    // Mock tenants from our existing data
    const mockTenants: Omit<Tenant, 'suite'>[] = [
      {
        id: "meta-inc",
        name: "Meta Inc.",
        logo: "/placeholder.svg",
        industry: "technology",
        rsf: 15000,
        leaseStart: "2023-01-01",
        leaseEnd: "2028-12-31",
        monthlyRent: 45000,
        status: "active",
        contactName: "Sarah Johnson"
      },
      {
        id: "airbnb",
        name: "Airbnb",
        logo: "/placeholder.svg",
        industry: "technology",
        rsf: 20000,
        leaseStart: "2022-06-01",
        leaseEnd: "2027-05-31",
        monthlyRent: 60000,
        status: "active",
        contactName: "Michael Chen"
      },
      {
        id: "amazon",
        name: "Amazon",
        logo: "/placeholder.svg",
        industry: "technology",
        rsf: 18000,
        leaseStart: "2023-03-01",
        leaseEnd: "2026-02-28",
        monthlyRent: 54000,
        status: "expiring-soon",
        contactName: "Jennifer Lee"
      },
      {
        id: "citi",
        name: "Citi",
        logo: "/placeholder.svg",
        industry: "finance",
        rsf: 12000,
        leaseStart: "2024-01-01",
        leaseEnd: "2029-12-31",
        monthlyRent: 36000,
        status: "active",
        contactName: "David Rodriguez"
      },
      {
        id: "zoominfo",
        name: "ZoomInfo",
        logo: "/placeholder.svg",
        industry: "technology",
        rsf: 8000,
        leaseStart: "2023-09-01",
        leaseEnd: "2026-08-31",
        monthlyRent: 24000,
        status: "active",
        contactName: "Lisa Wang"
      },
      {
        id: "nike",
        name: "Nike, Inc.",
        logo: "/placeholder.svg",
        industry: "retail",
        rsf: 10000,
        leaseStart: "2022-12-01",
        leaseEnd: "2025-11-30",
        monthlyRent: 30000,
        status: "expiring-soon",
        contactName: "Mark Thompson"
      },
      {
        id: "peloton",
        name: "Peloton",
        logo: "/placeholder.svg",
        industry: "fitness",
        rsf: 14000,
        leaseStart: "2023-05-01",
        leaseEnd: "2028-04-30",
        monthlyRent: 42000,
        status: "active",
        contactName: "Amanda Foster"
      },
      {
        id: "bloomberg",
        name: "Bloomberg L.P.",
        logo: "/placeholder.svg",
        industry: "finance",
        rsf: 25000,
        leaseStart: "2021-01-01",
        leaseEnd: "2026-12-31",
        monthlyRent: 75000,
        status: "active",
        contactName: "Robert Kim"
      }
    ]

    let tenantIndex = 0
    for (let i = totalFloors; i >= 1; i--) {
      const floorRsf = i === 1 ? avgFloorRsf + 5000 : avgFloorRsf // Ground floor larger
      const floor: Floor = {
        number: i,
        totalRsf: floorRsf,
        availableRsf: 0,
        tenants: [],
        occupancyRate: 0
      }

      // Distribute tenants across floors
      if (i === 12 || i === 11) {
        // Top floors - executive suites, smaller tenants
        const numTenants = Math.random() > 0.3 ? 1 : 0
        for (let j = 0; j < numTenants && tenantIndex < mockTenants.length; j++) {
          const tenant = { ...mockTenants[tenantIndex], suite: `${i}0${j + 1}` }
          tenant.rsf = Math.min(tenant.rsf, floorRsf - 2000) // Leave some space
          floor.tenants.push(tenant)
          tenantIndex++
        }
      } else if (i >= 6) {
        // Mid floors - mix of larger and smaller tenants
        const numTenants = Math.floor(Math.random() * 2) + 1
        for (let j = 0; j < numTenants && tenantIndex < mockTenants.length; j++) {
          const tenant = { ...mockTenants[tenantIndex], suite: `${i}0${j + 1}` }
          if (j === 0 && Math.random() > 0.5) {
            tenant.rsf = Math.min(floorRsf * 0.8, tenant.rsf) // Large tenant takes most of floor
          } else {
            tenant.rsf = Math.min(floorRsf * 0.4, tenant.rsf)
          }
          floor.tenants.push(tenant)
          tenantIndex++
        }
      } else {
        // Lower floors - larger anchor tenants
        if (tenantIndex < mockTenants.length) {
          const tenant = { ...mockTenants[tenantIndex], suite: `${i}01` }
          tenant.rsf = Math.min(floorRsf * 0.9, tenant.rsf)
          floor.tenants.push(tenant)
          tenantIndex++
        }
      }

      // Add vacant spaces occasionally
      if (Math.random() > 0.7) {
        const vacantRsf = Math.floor(Math.random() * 8000) + 2000
        floor.tenants.push({
          id: `vacant-${i}`,
          name: "Available Space",
          industry: "vacant",
          rsf: vacantRsf,
          leaseStart: "",
          leaseEnd: "",
          monthlyRent: 0,
          status: "vacant",
          contactName: "Leasing Team",
          suite: `${i}XX`
        })
      }

      // Calculate occupancy
      const occupiedRsf = floor.tenants.reduce((sum, t) => sum + (t.status !== 'vacant' ? t.rsf : 0), 0)
      floor.availableRsf = floor.totalRsf - floor.tenants.reduce((sum, t) => sum + t.rsf, 0)
      floor.occupancyRate = (occupiedRsf / floor.totalRsf) * 100

      floors.push(floor)
    }

    return floors
  }

  const floors = generateFloorData()

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when fullscreen
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isFullscreen])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 text-xs">• Active</Badge>
      case "expiring-soon":
        return <Badge className="bg-orange-100 text-orange-800 text-xs">• Expiring Soon</Badge>
      case "vacant":
        return <Badge className="bg-gray-100 text-gray-600 text-xs">• Vacant</Badge>
      default:
        return <Badge variant="secondary" className="text-xs">• {status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredFloors = floors.filter(floor => {
    if (filterStatus === "all") return true
    return floor.tenants.some(tenant => tenant.status === filterStatus)
  })

  // Component for the stacking plan content that can be reused in both normal and fullscreen mode
  const StackingPlanContent = ({ showHeader = true, containerClass = "" }: { showHeader?: boolean; containerClass?: string }) => (
    <div className={containerClass}>
      {showHeader && (
        <>
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Stacking Plan</h2>
              <p className="text-sm text-gray-600">Floor-by-floor tenant visualization</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by tenant"
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                  <SelectItem value="vacant">Vacant</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {!isFullscreen && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsFullscreen(true)}
                  className="hover:bg-gray-50"
                >
                  <Maximize className="h-4 w-4 mr-2" />
                  Fullscreen
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Floor Stacking Plan - Visual Layout */}
      <div className={isFullscreen ? "max-w-7xl mx-auto" : "max-w-4xl mx-auto"}>
        <div className="space-y-2">
          {filteredFloors.map((floor) => {
            const visibleTenants = floor.tenants.filter(tenant => 
              searchQuery === "" || 
              tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              tenant.suite.toLowerCase().includes(searchQuery.toLowerCase())
            )
            
            if (visibleTenants.length === 0 && searchQuery !== "") return null

            return (
              <div key={floor.number} className="flex items-center gap-4">
                {/* Floor Number */}
                <div className="flex flex-col items-center justify-center w-16 text-center">
                  <div className="text-2xl font-bold text-gray-900">{floor.number}</div>
                  <div className="text-xs text-gray-500">
                    {formatNumber(floor.totalRsf)} RSF
                  </div>
                  <div className="text-xs text-gray-500">
                    {floor.occupancyRate.toFixed(0)}% occupied
                  </div>
                </div>

                {/* Floor Layout */}
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[80px]">
                  <div className="flex flex-wrap gap-2">
                    {visibleTenants.map((tenant) => {
                      // Calculate width based on RSF (relative to floor size)
                      const widthPercent = Math.max(15, Math.min(100, (tenant.rsf / floor.totalRsf) * 100))
                      
                      return (
                        <div
                          key={tenant.id}
                          className={`
                            relative rounded-md p-3 border transition-all duration-200 hover:shadow-md cursor-pointer
                            ${tenant.status === 'vacant' 
                              ? 'bg-white border-gray-300 border-dashed' 
                              : tenant.status === 'expiring-soon'
                              ? 'bg-orange-50 border-orange-200'
                              : 'bg-white border-gray-200'
                            }
                          `}
                          style={{ 
                            minWidth: `${Math.max(200, widthPercent * (isFullscreen ? 4 : 3))}px`,
                            flexGrow: widthPercent > 50 ? 1 : 0
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 min-w-0">
                              <Avatar className="h-6 w-6 flex-shrink-0">
                                <AvatarImage src={tenant.logo || "/placeholder.svg"} />
                                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-medium">
                                  {tenant.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm text-gray-900 truncate">
                                  {tenant.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatNumber(tenant.rsf)} RSF
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0 ml-2">
                              {getStatusBadge(tenant.status)}
                            </div>
                          </div>
                          
                          {tenant.status !== 'vacant' && (
                            <div className="mt-2 text-xs text-gray-600">
                              <div>Suite {tenant.suite} • {formatCurrency(tenant.monthlyRent)}/mo</div>
                              <div>Lease expires {formatDate(tenant.leaseEnd)}</div>
                            </div>
                          )}
                          
                          {tenant.status === 'vacant' && (
                            <div className="mt-2 text-xs text-gray-500">
                              Suite {tenant.suite} • Available
                            </div>
                          )}
                          
                          {/* Status indicator bar */}
                          <div className={`
                            absolute bottom-0 left-0 right-0 h-1 rounded-b-md
                            ${tenant.status === 'vacant' 
                              ? 'bg-gray-300' 
                              : tenant.status === 'expiring-soon'
                              ? 'bg-orange-400'
                              : 'bg-green-400'
                            }
                          `} />
                        </div>
                      )
                    })}
                    
                    {/* Vacant Space Indicator */}
                    {floor.availableRsf > 0 && visibleTenants.filter(t => t.status === 'vacant').length === 0 && (
                      <div className="bg-gray-100 border border-gray-300 border-dashed rounded-md p-3 flex items-center justify-center min-w-[150px]">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Available</div>
                          <div className="text-xs font-medium text-gray-700">
                            {formatNumber(floor.availableRsf)} RSF
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <StackingPlanContent containerClass="p-6 space-y-6" />

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-white">
          {/* Fullscreen Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{buildingData?.name || 'Building'} - Stacking Plan</h1>
              <p className="text-sm text-gray-600">Floor-by-floor tenant visualization</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by tenant"
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                  <SelectItem value="vacant">Vacant</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFullscreen(false)}
                className="hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-2" />
                Exit Fullscreen
              </Button>
            </div>
          </div>

          {/* Fullscreen Content */}
          <div className="h-[calc(100vh-88px)] overflow-auto p-6">
            <StackingPlanContent showHeader={false} />
          </div>
        </div>
      )}
    </>
  )
}
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Award, 
  Users, 
  DollarSign,
  TrendingUp,
  Gauge,
  Settings,
  Shield
} from "lucide-react"

interface OverviewTabProps {
  buildingData: any
}

export function OverviewTab({ buildingData }: OverviewTabProps) {
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

  const calculateCapRate = () => {
    if (buildingData.current_valuation && buildingData.noi) {
      return ((buildingData.noi / buildingData.current_valuation) * 100).toFixed(1)
    }
    return "N/A"
  }

  const getRentPerSqft = () => {
    if (buildingData.rent_per_sf) {
      return buildingData.rent_per_sf
    }
    if (buildingData.monthly_rent_roll && buildingData.square_foot) {
      const annualRent = buildingData.monthly_rent_roll * 12
      return (annualRent / buildingData.square_foot).toFixed(2)
    }
    return "N/A"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total RSF</p>
                <p className="text-2xl font-bold">{formatNumber(buildingData.square_foot)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Gauge className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
                <p className="text-2xl font-bold">{buildingData.occupancy_rate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Rent Roll</p>
                <p className="text-2xl font-bold">{formatCurrency(buildingData.monthly_rent_roll)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">NOI</p>
                <p className="text-2xl font-bold">{formatCurrency(buildingData.noi)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Property Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Asset Type</p>
                <p className="text-gray-900">{buildingData.asset_type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Building Class</p>
                <p className="text-gray-900">{buildingData.building_class}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Year Built</p>
                <p className="text-gray-900">{buildingData.year_built}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Floors</p>
                <p className="text-gray-900">{buildingData.floors}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Parking Spaces</p>
                <p className="text-gray-900">{buildingData.parking_spaces}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Elevators</p>
                <p className="text-gray-900">{buildingData.elevators}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Land Area</p>
                <p className="text-gray-900">{formatNumber(buildingData.land_area)} sq ft</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Zoning</p>
                <p className="text-gray-900">{buildingData.zoning}</p>
              </div>
            </div>
            
            {/* Certifications */}
            {(buildingData.leed_certification_level || buildingData.energy_rating) && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-500 mb-2">Certifications</p>
                <div className="flex items-center space-x-2 flex-wrap gap-2">
                  {buildingData.leed_certification_level && (
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4 text-green-600" />
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        LEED Level {buildingData.leed_certification_level}
                      </Badge>
                    </div>
                  )}
                  {buildingData.energy_rating && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {buildingData.energy_rating}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Financial Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Annual Revenue</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(buildingData.revenue)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Annual Expenses</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(buildingData.expenses)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Net Operating Income</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(buildingData.noi)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Cap Rate</p>
                  <p className="text-lg font-bold text-gray-900">{calculateCapRate()}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Rent / Sq Ft</p>
                  <p className="text-lg font-bold text-gray-900">${getRentPerSqft()}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Building Score</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xl font-bold text-gray-900">{buildingData.building_score}/100</p>
                  <Badge variant={buildingData.building_score >= 80 ? "default" : "secondary"}>
                    {buildingData.building_score >= 80 ? "Excellent" : "Good"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Management & Ownership */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Management & Ownership
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Owner</p>
              <p className="text-gray-900">{buildingData.owner_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Management Company</p>
              <p className="text-gray-900">{buildingData.management_company}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Property Manager</p>
              <p className="text-gray-900">{buildingData.property_manager}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Ownership Type</p>
              <p className="text-gray-900">{buildingData.ownership_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Purchase Date</p>
              <p className="text-gray-900">{new Date(buildingData.purchase_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Purchase Price</p>
              <p className="text-gray-900">{formatCurrency(buildingData.purchase_price)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Building Systems */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Building Systems
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">HVAC System</p>
              <p className="text-gray-900">{buildingData.hvac_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Security System</p>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <p className="text-gray-900">{buildingData.security_system}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Fire Safety System</p>
              <p className="text-gray-900">{buildingData.fire_system}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Roof Type</p>
              <p className="text-gray-900">{buildingData.roof_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Roof Last Replaced</p>
              <p className="text-gray-900">{new Date(buildingData.roof_last_replaced).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Facade Material</p>
              <p className="text-gray-900">{buildingData.facade_material}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Inspection</p>
              <p className="text-gray-900">{new Date(buildingData.last_inspection).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Accessibility</p>
              <p className="text-gray-900">{buildingData.accessibility_features}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState, useMemo, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { GlobalSearch } from "@/components/global-search"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  Plus, 
  Filter, 
  FileText, 
  Building2, 
  DollarSign, 
  Calendar, 
  Download,
  ArrowUpDown,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"
import Link from "next/link"
import { getLeases } from "@/lib/leasesData"
import { AddLeaseModal } from "@/components/add-lease-modal"

// Filter options for lease statuses
const leaseStatuses = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "expiring-soon", label: "Expiring Soon" },
  { value: "pending", label: "Pending" },
  { value: "terminated", label: "Terminated" },
]

// Filter options for lease structures
const leaseStructures = [
  { value: "all", label: "All Structures" },
  { value: "Triple Net (NNN)", label: "Triple Net (NNN)" },
  { value: "Modified Gross (MG)", label: "Modified Gross (MG)" },
  { value: "Full-Service Gross (FSG)", label: "Full-Service Gross (FSG)" },
  { value: "Single Net (N)", label: "Single Net (N)" },
  { value: "Double Net (NN)", label: "Double Net (NN)" },
  { value: "Absolute NNN", label: "Absolute NNN" },
]



export default function LeasesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedStructure, setSelectedStructure] = useState("all")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [isAddLeaseModalOpen, setIsAddLeaseModalOpen] = useState(false)
  const [leases, setLeases] = useState<any[]>([])

  // Load leases from mock database
  useEffect(() => {
    setLeases(getLeases())
  }, [])

  // Filter and search functionality
  const filteredLeases = useMemo(() => {
    let filtered = leases

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(lease =>
        lease.tenant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lease.lease_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lease.building_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(lease => lease.lease_status === selectedStatus)
    }

    // Filter by lease structure
    if (selectedStructure !== "all") {
      filtered = filtered.filter(lease => lease.lease_structure === selectedStructure)
    }

    // Sort functionality
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortField as keyof typeof a]
        let bValue: any = b[sortField as keyof typeof b]

        // Handle date sorting
        if (sortField === 'commencement_date' || sortField === 'expiration_date') {
          aValue = new Date(aValue).getTime()
          bValue = new Date(bValue).getTime()
        }

        // Handle numeric sorting
        if (sortField === 'base_rent_annual') {
          aValue = Number(aValue)
          bValue = Number(bValue)
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [searchQuery, selectedStatus, selectedStructure, sortField, sortDirection, leases])

  // Calculate key metrics
  const activeLeases = leases.filter(lease => lease.lease_status === 'active')
  const totalActiveLeases = activeLeases.length
  const totalAnnualRent = activeLeases.reduce((sum, lease) => sum + lease.base_rent_annual, 0)
  const upcomingExpirations = leases.filter(lease => lease.days_until_expiry > 0 && lease.days_until_expiry <= 90).length

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get lease status badge
  const getStatusBadge = (status: string, daysUntilExpiry: number) => {
    const badgeClasses = {
      active: "bg-green-100 text-green-800",
      expired: "bg-red-100 text-red-800",
      "expiring-soon": "bg-yellow-100 text-yellow-800",
      pending: "bg-blue-100 text-blue-800",
      terminated: "bg-gray-100 text-gray-800",
    }

    const statusIcons = {
      active: CheckCircle,
      expired: AlertTriangle,
      "expiring-soon": Clock,
      pending: Clock,
      terminated: AlertTriangle,
    }

    const Icon = statusIcons[status as keyof typeof statusIcons] || CheckCircle
    const displayStatus = status === 'expiring-soon' ? `Expires in ${daysUntilExpiry} days` : status.replace('-', ' ')

    return (
      <Badge className={`${badgeClasses[status as keyof typeof badgeClasses]} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {displayStatus}
      </Badge>
    )
  }

  // Export to CSV functionality
  const exportToCSV = () => {
    const headers = [
      'Lease ID',
      'Tenant Name',
      'Building',
      'Commencement Date',
      'Expiration Date',
      'Annual Rent',
      'Lease Term (Months)',
      'Lease Structure',
      'Status'
    ]

    const csvData = filteredLeases.map(lease => [
      lease.lease_id,
      lease.tenant_name,
      lease.building_name,
      lease.commencement_date,
      lease.expiration_date,
      lease.base_rent_annual,
      lease.lease_term_months,
      lease.lease_structure,
      lease.lease_status
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `leases-export-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4">
          <div className="page-header">
            <div>
              <h1 className="page-title">Leases</h1>
              <p className="page-subtitle">Manage and track all lease agreements across your portfolio</p>
            </div>
            <div className="flex items-center space-x-4">
              <GlobalSearch />
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsAddLeaseModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Lease
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Active Leases</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalActiveLeases}</div>
                <p className="text-xs text-muted-foreground">
                  Active lease agreements
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Annual Rent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalAnnualRent)}</div>
                <p className="text-xs text-muted-foreground">
                  From active leases
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Expirations</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{upcomingExpirations}</div>
                <p className="text-xs text-muted-foreground">
                  Expiring within 90 days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">All Leases ({filteredLeases.length})</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search leases, tenants, or buildings..."
                    className="pl-9 w-80"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaseStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStructure} onValueChange={setSelectedStructure}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All structures" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaseStructures.map((structure) => (
                      <SelectItem key={structure.value} value={structure.value}>
                        {structure.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={exportToCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Data Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="text-left font-medium text-gray-500">Tenant</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Building & Space</TableHead>
                      <TableHead 
                        className="text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort('commencement_date')}
                      >
                        <div className="flex items-center">
                          Commencement Date
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort('expiration_date')}
                      >
                        <div className="flex items-center">
                          Expiration Date
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort('base_rent_annual')}
                      >
                        <div className="flex items-center">
                          Annual Rent
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Term</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Lease Structure</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Status</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Document</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeases.map((lease) => (
                      <TableRow key={lease.lease_id} className="border-b border-gray-100 hover:bg-gray-50">
                        <TableCell className="py-4">
                          <Link href={`/leases/${lease.lease_id}`} className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={lease.tenant_logo} />
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                                {lease.tenant_name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">{lease.tenant_name}</div>
                              <div className="text-sm text-gray-500">ID: {lease.lease_id}</div>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="py-4">
                          <div>
                            <div className="font-medium text-gray-900">{lease.building_name}</div>
                            <div className="text-sm text-gray-500">{lease.space_info}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-gray-900">{formatDate(lease.commencement_date)}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-gray-900">{formatDate(lease.expiration_date)}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-gray-900 font-medium">{formatCurrency(lease.base_rent_annual)}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-gray-900">{lease.lease_term_months} months</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className="text-xs">
                            {lease.lease_structure}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          {getStatusBadge(lease.lease_status, lease.days_until_expiry)}
                        </TableCell>
                        <TableCell className="py-4">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={lease.lease_document_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Document
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Lease Modal */}
        <AddLeaseModal
          isOpen={isAddLeaseModalOpen}
          onClose={() => setIsAddLeaseModalOpen(false)}
          onLeaseAdded={() => {
            setLeases(getLeases())
            setIsAddLeaseModalOpen(false)
          }}
        />
      </div>
    </div>
  )
} 
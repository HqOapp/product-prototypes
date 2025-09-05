"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { GlobalSearch } from "@/components/global-search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  FileText,
  Building2,
  DollarSign,
  Calendar,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Home,
  Banknote,
  Settings,
  User,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { getLeaseById } from "@/lib/leasesData";

// Mock data for lease details (in real app, this would come from API)
const mockLeaseData = {
  "LSE-001": {
    lease_id: "LSE-001",
    tenant_id: 1,
    tenant_name: "EcoVolt Energy Solutions",
    tenant_logo:
      "https://dmevq6vd3sz66.cloudfront.net/uploads/ee26908bf9629eeb4b37dac350f4754a_1710446739196.png",
    tenant_industry: "Technology",
    execution_date: "2022-01-01",
    commencement_date: "2022-01-15",
    expiration_date: "2027-01-14",
    base_rent_annual: 750000,
    lease_term_months: 60,
    property_type: "Office",
    lease_structure: "Triple Net (NNN)",
    security_deposit: 125000,
    renewal_option: true,
    escalation_clause: { type: "Percentage", rate: 3, frequency: "Annual" },
    escalation_rate: 3.0,
    lease_document_url: "https://docs.example.com/lease-001.pdf",
    lease_status: "active",
    building_name: "Cobblestone Collaborative",
    building_id: "BLD-001",
    rent_roll: 62500, // Monthly rent

    // Operations data
    landlord_obligations: [
      "Structural maintenance and repairs",
      "Common area maintenance",
      "Property insurance",
      "Property tax payments",
      "Building security systems",
    ],
    tenant_obligations: [
      "Interior maintenance and repairs",
      "Utilities payments",
      "General liability insurance",
      "Compliance with building rules",
      "Monthly rent payments",
    ],
    sublease_policy: "Permitted with landlord's written consent",

    // Premises data
    leased_spaces: [
      {
        space_id: "SPC-001",
        unit_number: "Suite 901",
        area: 7500,
        floor: 9,
        space_type: "Office",
      },
      {
        space_id: "SPC-002",
        unit_number: "Suite 801",
        area: 5000,
        floor: 8,
        space_type: "Office",
      },
    ],

    // Documents data
    amendment_history: [
      {
        id: 1,
        type: "Amendment 1",
        date: "2023-01-15",
        description: "Rent escalation adjustment",
        document_url: "https://docs.example.com/amendment-001-1.pdf",
      },
      {
        id: 2,
        type: "Certificate of Insurance",
        date: "2024-01-01",
        description: "Updated insurance certificate",
        document_url: "https://docs.example.com/insurance-001.pdf",
      },
    ],

    // Payment history (mock data)
    payment_history: [
      { date: "2024-01-01", amount: 62500, status: "Paid", type: "Base Rent" },
      { date: "2023-12-01", amount: 62500, status: "Paid", type: "Base Rent" },
      { date: "2023-11-01", amount: 62500, status: "Paid", type: "Base Rent" },
      { date: "2023-10-01", amount: 60729, status: "Paid", type: "Base Rent" },
      { date: "2023-09-01", amount: 60729, status: "Paid", type: "Base Rent" },
    ],
  },
  "LSE-002": {
    lease_id: "LSE-002",
    tenant_id: 2,
    tenant_name: "NextGen Biotech",
    tenant_logo: "/placeholder.svg?height=40&width=40&text=NB",
    tenant_industry: "Biotechnology",
    execution_date: "2021-06-15",
    commencement_date: "2021-07-01",
    expiration_date: "2024-06-30",
    base_rent_annual: 480000,
    lease_term_months: 36,
    property_type: "Lab",
    lease_structure: "Modified Gross (MG)",
    security_deposit: 80000,
    renewal_option: false,
    escalation_clause: { type: "Fixed", rate: 2500, frequency: "Monthly" },
    escalation_rate: 2.0,
    lease_document_url: "https://docs.example.com/lease-002.pdf",
    lease_status: "expiring-soon",
    building_name: "Innovation Hub",
    building_id: "BLD-003",
    rent_roll: 40000,

    landlord_obligations: [
      "Building maintenance",
      "Common utilities",
      "Lab equipment servicing",
      "HVAC maintenance",
    ],
    tenant_obligations: [
      "Lab space maintenance",
      "Specialized equipment insurance",
      "Hazardous waste disposal",
      "Safety compliance",
    ],
    sublease_policy: "Not permitted",

    leased_spaces: [
      {
        space_id: "SPC-003",
        unit_number: "Lab Suite 401-403",
        area: 8000,
        floor: 4,
        space_type: "Laboratory",
      },
    ],

    amendment_history: [
      {
        id: 1,
        type: "Amendment 1",
        date: "2022-07-01",
        description: "Equipment installation addendum",
        document_url: "https://docs.example.com/amendment-002-1.pdf",
      },
    ],

    payment_history: [
      { date: "2024-01-01", amount: 40000, status: "Paid", type: "Base Rent" },
      { date: "2023-12-01", amount: 40000, status: "Paid", type: "Base Rent" },
      { date: "2023-11-01", amount: 40000, status: "Late", type: "Base Rent" },
    ],
  },
};

export default function LeaseDetailPage() {
  const params = useParams();
  const leaseId = params.lease_id as string;
  const [activeTab, setActiveTab] = useState("general");

  // Get lease data from mock database
  const lease = getLeaseById(leaseId);

  if (!lease) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Lease Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The lease you're looking for doesn't exist.
            </p>
            <Link href="/leases">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Leases
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format number
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  // Get lease status badge
  const getStatusBadge = (status: string) => {
    const badgeClasses = {
      active: "bg-green-100 text-green-800",
      expired: "bg-red-100 text-red-800",
      "expiring-soon": "bg-yellow-100 text-yellow-800",
      pending: "bg-blue-100 text-blue-800",
      terminated: "bg-gray-100 text-gray-800",
    };

    const statusIcons = {
      active: CheckCircle,
      expired: AlertTriangle,
      "expiring-soon": Clock,
      pending: Clock,
      terminated: AlertTriangle,
    };

    const Icon = statusIcons[status as keyof typeof statusIcons] || CheckCircle;

    return (
      <Badge
        className={`${badgeClasses[status as keyof typeof badgeClasses]} flex items-center gap-1`}
      >
        <Icon className="h-3 w-3" />
        {status.replace("-", " ")}
      </Badge>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/leases">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Leases
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Lease {lease.lease_id} - {lease.tenant_name}
                </h1>
                <p className="text-gray-600">
                  {lease.building_name} • {lease.lease_structure}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <GlobalSearch />
              <Link href={`/tenants/${lease.tenant_id}`}>
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  View Tenant
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger
                  value="general"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="parties"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Parties
                </TabsTrigger>
                <TabsTrigger
                  value="premises"
                  className="flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  Premises
                </TabsTrigger>
                <TabsTrigger value="rent" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Rent
                </TabsTrigger>
                <TabsTrigger
                  value="operations"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Operations
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Documents
                </TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Lease Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Lease ID
                          </label>
                          <p className="text-sm text-gray-900">
                            {lease.lease_id}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Lease Type
                          </label>
                          <p className="text-sm text-gray-900">
                            {lease.lease_structure}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Property Type
                          </label>
                          <p className="text-sm text-gray-900">
                            {lease.property_type}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Status
                          </label>
                          <div className="mt-1">
                            {getStatusBadge(lease.lease_status)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Term & Dates
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Execution Date
                          </label>
                          <p className="text-sm text-gray-900">
                            {formatDate(lease.execution_date)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Commencement Date
                          </label>
                          <p className="text-sm text-gray-900">
                            {formatDate(lease.commencement_date)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Expiration Date
                          </label>
                          <p className="text-sm text-gray-900">
                            {formatDate(lease.expiration_date)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Lease Term
                          </label>
                          <p className="text-sm text-gray-900">
                            {lease.lease_term_months} months
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Financial Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Security Deposit
                          </label>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(lease.security_deposit)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Monthly Rent Roll
                          </label>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(lease.rent_roll)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Annual Base Rent
                          </label>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(lease.base_rent_annual)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Renewal Option
                          </label>
                          <p className="text-sm text-gray-900">
                            {lease.renewal_option ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Escalation Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Escalation Type
                          </label>
                          <p className="text-sm text-gray-900">
                            {lease.escalation_clause.type}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Escalation Rate
                          </label>
                          <p className="text-sm text-gray-900">
                            {lease.escalation_rate}%
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Frequency
                          </label>
                          <p className="text-sm text-gray-900">
                            {lease.escalation_clause.frequency}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Parties Tab */}
              <TabsContent value="parties" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Tenant Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={lease.tenant_logo} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-lg">
                            {lease.tenant_name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {lease.tenant_name}
                          </h3>
                          <p className="text-gray-600">
                            Tenant ID: {lease.tenant_id}
                          </p>
                          <p className="text-gray-600">
                            Industry: {lease.tenant_industry}
                          </p>
                        </div>
                      </div>
                      <Link href={`/tenants/${lease.tenant_id}`}>
                        <Button>
                          <User className="mr-2 h-4 w-4" />
                          View Tenant Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Landlord Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Property Owner
                        </label>
                        <p className="text-sm text-gray-900">
                          Quantum City Investments
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Property Manager
                        </label>
                        <p className="text-sm text-gray-900">
                          HqO Property Management
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Building
                        </label>
                        <p className="text-sm text-gray-900">
                          {lease.building_name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Building ID
                        </label>
                        <p className="text-sm text-gray-900">
                          {lease.building_id}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Premises Tab */}
              <TabsContent value="premises" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Leased Spaces
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Space ID</TableHead>
                          <TableHead>Unit Number</TableHead>
                          <TableHead>Floor</TableHead>
                          <TableHead>Area (sq ft)</TableHead>
                          <TableHead>Space Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lease.leased_spaces.map((space) => (
                          <TableRow key={space.space_id}>
                            <TableCell className="font-medium">
                              {space.space_id}
                            </TableCell>
                            <TableCell>{space.unit_number}</TableCell>
                            <TableCell>{space.floor}</TableCell>
                            <TableCell>{formatNumber(space.area)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {space.space_type}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm font-medium text-gray-500">
                          Total Leased Area
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatNumber(
                            lease.leased_spaces.reduce(
                              (sum, space) => sum + space.area,
                              0
                            )
                          )}{" "}
                          sq ft
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm font-medium text-gray-500">
                          Number of Spaces
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {lease.leased_spaces.length}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm font-medium text-gray-500">
                          Rent per Sq Ft
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          $
                          {(
                            lease.base_rent_annual /
                            lease.leased_spaces.reduce(
                              (sum, space) => sum + space.area,
                              0
                            )
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Rent Tab */}
              <TabsContent value="rent" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Banknote className="h-5 w-5" />
                        Rent Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Base Annual Rent
                          </label>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(lease.base_rent_annual)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Monthly Rent
                          </label>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(lease.rent_roll)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Escalation Rate
                          </label>
                          <p className="text-lg font-semibold text-gray-900">
                            {lease.escalation_rate}% annually
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Payment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {lease.payment_history.map((payment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {payment.type}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(payment.date)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(payment.amount)}
                              </p>
                              <Badge
                                className={`text-xs ${payment.status === "Paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                              >
                                {payment.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Operations Tab */}
              <TabsContent value="operations" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Landlord Obligations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {lease.landlord_obligations.map((obligation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">
                              {obligation}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Tenant Obligations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {lease.tenant_obligations.map((obligation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">
                              {obligation}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Sublease Policy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">
                          {lease.sublease_policy}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Primary Lease Document
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Lease Agreement {lease.lease_id}
                          </p>
                          <p className="text-sm text-gray-500">
                            Executed on {formatDate(lease.execution_date)}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" asChild>
                        <a
                          href={lease.lease_document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Document
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Amendment History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {lease.amendment_history.map((amendment) => (
                        <div
                          key={amendment.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-6 w-6 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {amendment.type}
                              </p>
                              <p className="text-sm text-gray-500">
                                {amendment.description}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatDate(amendment.date)}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={amendment.document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

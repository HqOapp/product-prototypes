"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Sidebar } from "@/components/sidebar"
import { GlobalSearch } from "@/components/global-search"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ChevronDown, Users, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/ui/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type PersonType = {
  id: string
  name: string
  email: string
  company: string
  building: string
  buildingIcon: string
  type: string | string[]
  tags: string[]
  channels: string[]
  avatar: string
  initials: string
  buildingCount?: number
  isAdmin?: boolean
}

// Updated mock data with Unsplash profile images
const mockPersons: PersonType[] = [
  {
    id: "1",
    name: "Dennis Callis",
    email: "rodger913@aol.com",
    company: "ACME",
    building: "Building A",
    buildingIcon: "/placeholder.svg",
    type: "Tenant",
    tags: ["VIP"],
    channels: ["Email"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    initials: "DC",
  },
  {
    id: "2",
    name: "Kimberly Mastrangelo",
    email: "stephanienicol@outlook.com",
    company: "Segment",
    building: "Building B",
    buildingIcon: "/placeholder.svg",
    type: ["Lead", "Tenant"],
    tags: ["VIP"],
    channels: ["App", "Email", "Text"],
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    initials: "KM",
  },
  {
    id: "3",
    name: "Corina McCoy",
    email: "judith403@gmail.com",
    company: "Leapyear",
    building: "Building A",
    buildingIcon: "/placeholder.svg",
    type: "Vendor",
    tags: ["Decision maker"],
    channels: ["App", "Email"],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    initials: "CM",
  },
  {
    id: "4",
    name: "Jerry Helfer",
    email: "j.jones@outlook.com",
    company: "ContrastAI",
    building: "Building B",
    buildingIcon: "/placeholder.svg",
    type: ["Lead", "Visitor"],
    tags: [],
    channels: [],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    initials: "JH",
  },
  {
    id: "5",
    name: "Rodger Struck",
    email: "dennis416@gmail.com",
    company: "Landlord Inc.",
    building: "Multiple Buildings",
    buildingIcon: "/placeholder.svg",
    buildingCount: 5,
    type: "Staff",
    tags: [],
    channels: ["App", "Text"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    initials: "RS",
  },
  {
    id: "6",
    name: "Iva Ryan",
    email: "b.b.lawlor@outlook.com",
    company: "Landlord Inc.",
    building: "Building C",
    buildingIcon: "/placeholder.svg",
    type: "Tenant",
    tags: [],
    channels: ["App"],
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
    initials: "IR",
  },
  {
    id: "7",
    name: "Bradley Lawlor",
    email: "f.j.swann@aol.com",
    company: "ACME",
    building: "Multiple Buildings",
    buildingIcon: "/placeholder.svg",
    buildingCount: 5,
    type: "Tenant",
    tags: ["Point of contact"],
    channels: ["App", "Email", "Text"],
    avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
    initials: "BL",
    isAdmin: true,
  },
  {
    id: "8",
    name: "Patricia Sanders",
    email: "eddie_lake@gmail.com",
    company: "Leapyear",
    building: "Building A",
    buildingIcon: "/placeholder.svg",
    type: "Tenant",
    tags: ["Executive"],
    channels: ["Email", "Text"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    initials: "PS",
  },
  {
    id: "9",
    name: "Kenneth Allen",
    email: "k.r.mastrangelo@outlook.com",
    company: "Landlord Inc.",
    building: "Multiple Buildings",
    buildingIcon: "/placeholder.svg",
    buildingCount: 5,
    type: "Staff",
    tags: [],
    channels: ["App"],
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    initials: "KA",
  },
  {
    id: "10",
    name: "Sarah Chen",
    email: "sarah.chen@ecovolt.com",
    company: "EcoVolt Energy",
    building: "Building A",
    buildingIcon: "/placeholder.svg",
    type: "Tenant",
    tags: ["VIP", "Executive"],
    channels: ["App", "Email"],
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    initials: "SC",
  },
  {
    id: "11",
    name: "Michael Rodriguez",
    email: "m.rodriguez@quantumanalytics.com",
    company: "Quantum Analytics",
    building: "Building B",
    buildingIcon: "/placeholder.svg",
    type: "Tenant",
    tags: ["Decision maker"],
    channels: ["Text"],
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    initials: "MR",
  },
  {
    id: "12",
    name: "Emily Watson",
    email: "e.watson@biotechinnovations.com",
    company: "BioTech Innovations",
    building: "Building C",
    buildingIcon: "/placeholder.svg",
    type: "Tenant",
    tags: ["Executive"],
    channels: [],
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    initials: "EW",
  },
  {
    id: "13",
    name: "David Thompson",
    email: "d.thompson@premiumrealty.com",
    company: "Premium Realty Group",
    building: "Multiple Buildings",
    buildingIcon: "/placeholder.svg",
    buildingCount: 3,
    type: "Broker",
    tags: ["Licensed broker"],
    channels: ["Email", "Text"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    initials: "DT",
  },
  {
    id: "14",
    name: "Lisa Chang",
    email: "l.chang@citycommercial.com",
    company: "City Commercial Partners",
    building: "Building A",
    buildingIcon: "/placeholder.svg",
    type: "Broker",
    tags: ["Commercial specialist"],
    channels: ["App", "Email"],
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    initials: "LC",
  },
  {
    id: "15",
    name: "Robert Martinez",
    email: "r.martinez@eliterealty.com",
    company: "Elite Realty Solutions",
    building: "Building B",
    buildingIcon: "/placeholder.svg",
    type: "Broker",
    tags: ["VIP", "Top performer"],
    channels: [],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    initials: "RM",
  },
]

const tabs = [
  { id: "all", label: "All people", count: mockPersons.length },
  { id: "leads", label: "Leads", count: mockPersons.filter(p => Array.isArray(p.type) ? p.type.includes("Lead") : p.type === "Lead").length },
  { id: "tenant-users", label: "Tenant users", count: mockPersons.filter(p => Array.isArray(p.type) ? p.type.includes("Tenant") : p.type === "Tenant").length },
  { id: "staff", label: "Staff", count: mockPersons.filter(p => p.type === "Staff").length },
  { id: "vendors", label: "Vendors", count: mockPersons.filter(p => p.type === "Vendor").length },
  { id: "brokers", label: "Brokers", count: mockPersons.filter(p => p.type === "Broker").length },
  { id: "visitors", label: "Visitors", count: mockPersons.filter(p => Array.isArray(p.type) ? p.type.includes("Visitor") : p.type === "Visitor").length },
]

export default function PeoplePage() {
  const [selectedCompany, setSelectedCompany] = useState("all")
  const [selectedBuilding, setSelectedBuilding] = useState("all")
  const [selectedTags, setSelectedTags] = useState("all")
  const [selectedChannel, setSelectedChannel] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const filteredPersons = mockPersons.filter((person) => {
    const matchesCompany = selectedCompany === "all" || person.company === selectedCompany
    const matchesBuilding = selectedBuilding === "all" || person.building.includes(selectedBuilding)
    const matchesTags = selectedTags === "all" || person.tags.includes(selectedTags as string)
    const matchesChannel = selectedChannel === "all" || person.channels.includes(selectedChannel)

    const matchesTab = activeTab === "all" || 
      (activeTab === "leads" && (Array.isArray(person.type) ? person.type.includes("Lead") : person.type === "Lead")) ||
      (activeTab === "tenant-users" && (Array.isArray(person.type) ? person.type.includes("Tenant") : person.type === "Tenant")) ||
      (activeTab === "staff" && person.type === "Staff") ||
      (activeTab === "vendors" && person.type === "Vendor") ||
      (activeTab === "brokers" && person.type === "Broker") ||
      (activeTab === "visitors" && (Array.isArray(person.type) ? person.type.includes("Visitor") : person.type === "Visitor"))

    return matchesCompany && matchesBuilding && matchesTags && matchesChannel && matchesTab
  })

  const getChannelBadge = (channel: string) => {
    return <Badge variant="secondary">{channel}</Badge>
  }

  const renderChannels = (channels: string[]) => {
    if (channels.length === 0) {
      return (
        <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
          Invite
        </Button>
      )
    }
    return (
      <div className="flex flex-wrap gap-1">
        {channels.map((channel, index) => (
          <span key={index}>{getChannelBadge(channel)}</span>
        ))}
      </div>
    )
  }

  const getTagBadge = (tag: string) => {
    const colors = {
      "VIP": "bg-purple-100 text-purple-800",
      "Decision maker": "bg-blue-100 text-blue-800",
      "Point of contact": "bg-green-100 text-green-800",
      "Executive": "bg-red-100 text-red-800",
      "Licensed broker": "bg-indigo-100 text-indigo-800",
      "Commercial specialist": "bg-teal-100 text-teal-800",
      "Top performer": "bg-yellow-100 text-yellow-800",
    }
    return <Badge className={colors[tag as keyof typeof colors] || "bg-gray-100 text-gray-800"}>{tag}</Badge>
  }

  const renderType = (type: string | string[]) => {
    if (Array.isArray(type)) {
      return type.map((t, index) => (
        <Badge key={index} variant="outline" className="mr-1">{t}</Badge>
      ))
    }
    return <Badge variant="outline">{type}</Badge>
  }

  const renderBuilding = (building: string, buildingCount?: number) => {
    if (buildingCount) {
      return (
        <div>
          <div className="font-medium">{building}</div>
          <div className="text-sm text-gray-500">{buildingCount} buildings</div>
        </div>
      )
    }
    return building
  }

  // Bulk action handlers
  const handleBulkDelete = (selectedRows: PersonType[]) => {
    console.log("Bulk delete:", selectedRows)
    // Implement bulk delete logic
  }

  const handleBulkEmail = (selectedRows: PersonType[]) => {
    console.log("Bulk email:", selectedRows)
    // Implement bulk email logic
  }

  const handleBulkInvite = (selectedRows: PersonType[]) => {
    console.log("Bulk invite:", selectedRows)
    // Implement bulk invite logic
  }

  // Column definitions
  const columns: ColumnDef<PersonType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const person = row.original
        return (
          <Link href={`/people/${person.id}`} className="flex items-center space-x-3 hover:bg-gray-50 -mx-2 px-2 py-1 rounded">
            <Avatar className="h-8 w-8">
              <AvatarImage src={person.avatar} alt={person.name} />
              <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                {person.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <p className="font-medium text-blue-600 hover:text-blue-800">{person.name}</p>
                {person.isAdmin && (
                  <Badge variant="outline" className="text-xs">Admin</Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">{person.email}</p>
            </div>
          </Link>
        )
      },
    },
    {
      accessorKey: "company",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Company" />
      ),
    },
    {
      accessorKey: "building",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Building" />
      ),
      cell: ({ row }) => {
        const person = row.original
        return renderBuilding(person.building, person.buildingCount)
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const person = row.original
        return renderType(person.type)
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const person = row.original
        return (
          <div className="flex flex-wrap gap-1">
            {person.tags.map((tag, index) => (
              <span key={index}>{getTagBadge(tag)}</span>
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: "channels",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Channels" />
      ),
      cell: ({ row }) => {
        const person = row.original
        return renderChannels(person.channels)
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const person = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(person.email)}
              >
                Copy email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/people/${person.id}`}>View profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Edit person</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Delete person
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4">
          <div className="page-header">
            <div>
              <h1 className="page-title">People</h1>
              <p className="page-subtitle">Manage leads, tenant users, staff, vendors, and visitors</p>
            </div>
            <div className="flex items-center space-x-4">
              <GlobalSearch />
              <Link href="/people/add">
                <Button className="bg-blue-600 hover:bg-blue-700">Add person</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-auto p-0 bg-transparent">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent px-4 py-3"
                >
                  {tab.label}
                  <Badge variant="secondary" className="ml-2 text-xs">{tab.count}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="page-container">
            {/* Title and Filters on Background */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">All People ({filteredPersons.length})</h3>
                <div className="flex items-center space-x-4">
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All companies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All companies</SelectItem>
                      <SelectItem value="ACME">ACME</SelectItem>
                      <SelectItem value="Segment">Segment</SelectItem>
                      <SelectItem value="Leapyear">Leapyear</SelectItem>
                      <SelectItem value="ContrastAI">ContrastAI</SelectItem>
                      <SelectItem value="Landlord Inc.">Landlord Inc.</SelectItem>
                      <SelectItem value="EcoVolt Energy">EcoVolt Energy</SelectItem>
                      <SelectItem value="Quantum Analytics">Quantum Analytics</SelectItem>
                      <SelectItem value="BioTech Innovations">BioTech Innovations</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All buildings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All buildings</SelectItem>
                      <SelectItem value="Building A">Building A</SelectItem>
                      <SelectItem value="Building B">Building B</SelectItem>
                      <SelectItem value="Building C">Building C</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="All channels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All channels</SelectItem>
                      <SelectItem value="App">App</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Text">Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Data Table with White Background */}
            <Card>
              <CardContent className="p-0">
                <DataTable
                  columns={columns}
                  data={filteredPersons}
                  searchKey="name"
                  searchPlaceholder="Search by name or email..."
                  onBulkDelete={handleBulkDelete}
                  onBulkEmail={handleBulkEmail}
                  onBulkInvite={handleBulkInvite}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 
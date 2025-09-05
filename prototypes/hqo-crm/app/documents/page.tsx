"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { GlobalSearch } from "@/components/global-search"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Calendar, ChevronDown, Download, Edit, Eye, FileText, Folder, Lock, MoreHorizontal, Plus, Search, Share2, Trash2, Upload, Users } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty, CommandSeparator } from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"

// Add company logo URLs for demo
const companyLogos: Record<string, string> = {
  "ACME Corp": "https://logo.clearbit.com/acme.com",
  "CleanCo": "https://logo.clearbit.com/cleanco.com",
  "Segment": "https://logo.clearbit.com/segment.com",
  "Internal": "",
}

// Add displayName to demo data
const demoDocuments = [
  {
    id: "1",
    displayName: "Lease Agreement",
    name: "2024 Lease Agreement.pdf",
    fileType: "pdf",
    category: "Lease",
    attachedTo: { type: "Tenant", name: "ACME Corp" },
    owner: "Landlord",
    uploadedBy: { name: "Sarah Lee", role: "Landlord", company: "Internal" },
    property: "Building A",
    sharedWith: "All Tenant Admins",
    sharedWithDetails: [],
    dateUploaded: new Date("2024-04-01T10:15:00"),
    lastUpdated: new Date("2024-04-02T09:00:00"),
    accessCount: 12,
  },
  {
    id: "2",
    displayName: "Insurance Certificate",
    name: "Insurance Certificate.jpg",
    fileType: "jpg",
    category: "COI",
    attachedTo: { type: "Vendor", name: "CleanCo" },
    owner: "Vendor",
    uploadedBy: { name: "Mike Brown", role: "Vendor", company: "CleanCo" },
    property: "Building B",
    sharedWith: "Specific Tenant Admins",
    sharedWithDetails: ["John Doe", "Jane Smith"],
    dateUploaded: new Date("2024-03-15T14:30:00"),
    lastUpdated: new Date("2024-03-20T11:00:00"),
    accessCount: 3,
  },
  {
    id: "3",
    displayName: "Fire Safety Policy",
    name: "Fire Safety Policy.docx",
    fileType: "docx",
    category: "Policy",
    attachedTo: { type: "Internal", name: "" },
    owner: "Landlord",
    uploadedBy: { name: "Sarah Lee", role: "Landlord", company: "Internal" },
    property: "Building A",
    sharedWith: "Internal Only",
    sharedWithDetails: [],
    dateUploaded: new Date("2024-02-10T08:00:00"),
    lastUpdated: new Date("2024-03-01T10:00:00"),
    accessCount: 0,
  },
  {
    id: "4",
    displayName: "Compliance Checklist",
    name: "Compliance Checklist.xlsx",
    fileType: "xlsx",
    category: "Compliance",
    attachedTo: { type: "Tenant", name: "Segment" },
    owner: "Tenant",
    uploadedBy: { name: "John Doe", role: "Tenant", company: "Segment" },
    property: "Building C",
    sharedWith: "All Admins & Users",
    sharedWithDetails: [],
    dateUploaded: new Date("2024-01-20T13:45:00"),
    lastUpdated: new Date("2024-02-01T09:30:00"),
    accessCount: 7,
  },
  {
    id: "5",
    displayName: "Building Map",
    name: "Building Map.pdf",
    fileType: "pdf",
    category: "Other",
    attachedTo: { type: "Internal", name: "" },
    owner: "Landlord",
    uploadedBy: { name: "Sarah Lee", role: "Landlord", company: "Internal" },
    property: "Building A",
    sharedWith: "Everyone",
    sharedWithDetails: [],
    dateUploaded: new Date("2024-04-03T16:00:00"),
    lastUpdated: new Date("2024-04-03T16:00:00"),
    accessCount: 22,
  },
]

const fileTypeIcon = (type: string) => {
  switch (type) {
    case "pdf": return <FileText className="inline h-4 w-4 text-red-500 mr-1" />
    case "jpg": return <FileText className="inline h-4 w-4 text-yellow-500 mr-1" />
    case "docx": return <FileText className="inline h-4 w-4 text-blue-500 mr-1" />
    case "xlsx": return <FileText className="inline h-4 w-4 text-green-500 mr-1" />
    default: return <FileText className="inline h-4 w-4 text-gray-400 mr-1" />
  }
}

const categoryBadge = (cat: string) => {
  const map = {
    Lease: "bg-blue-100 text-blue-800",
    COI: "bg-yellow-100 text-yellow-800",
    Compliance: "bg-green-100 text-green-800",
    Policy: "bg-purple-100 text-purple-800",
    Other: "bg-gray-100 text-gray-800",
  } as Record<string, string>
  return <Badge className={map[cat] || "bg-gray-100 text-gray-800"}>{cat}</Badge>
}

const ownerBadge = (owner: string) => {
  const map = {
    Landlord: "bg-blue-100 text-blue-800",
    Tenant: "bg-green-100 text-green-800",
    Vendor: "bg-yellow-100 text-yellow-800",
  } as Record<string, string>
  return <Badge className={map[owner] || "bg-gray-100 text-gray-800"}>{owner}</Badge>
}

const sharedWithPill = (shared: string, details: string[]) => {
  switch (shared) {
    case "All Tenant Admins":
      return <Badge className="bg-green-100 text-green-800">🟢 All Tenant Admins</Badge>
    case "Specific Tenant Admins":
      return <Badge className="bg-yellow-100 text-yellow-800" title={details.join(", ")}>🟡 Specific Tenant Admins</Badge>
    case "All Admins & Users":
      return <Badge className="bg-blue-100 text-blue-800">🔷 All Admins & Users</Badge>
    case "Everyone":
      return <Badge className="bg-sky-100 text-sky-800">🌐 Everyone</Badge>
    case "Internal Only":
      return <Badge className="bg-gray-200 text-gray-800">🔒 Internal Only</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800">{shared}</Badge>
  }
}

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Document" />,
    cell: ({ row }) => (
      <div className="py-2">
        <div className="text-xs text-gray-500 mb-1 font-semibold leading-tight">{row.original.displayName}</div>
        <Button variant="link" className="p-0 h-auto text-left font-medium text-blue-700" onClick={() => alert("Preview/Download: " + row.original.name)}>
          {row.original.name}
        </Button>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => categoryBadge(row.original.category),
    enableSorting: false,
  },
  {
    accessorKey: "attachedTo",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Attached To" />,
    cell: ({ row }) => {
      const a = row.original.attachedTo
      if (a.type === "Internal") {
        return <span className="text-gray-400">-</span>
      }
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex -space-x-2">
              <Avatar className="h-7 w-7 border-2 border-white bg-white">
                <AvatarImage src={companyLogos[a.name] || undefined} alt={a.name} />
                <AvatarFallback>{a.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          </TooltipTrigger>
          <TooltipContent>{a.name}</TooltipContent>
        </Tooltip>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "uploadedBy",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Uploaded By" />,
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 border-2 border-white bg-white">
              <AvatarImage src={companyLogos[row.original.uploadedBy.company] || undefined} alt={row.original.uploadedBy.company} />
              <AvatarFallback>{row.original.uploadedBy.company ? row.original.uploadedBy.company[0] : "U"}</AvatarFallback>
            </Avatar>
            <span>{row.original.uploadedBy.name}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>{row.original.uploadedBy.company}</TooltipContent>
      </Tooltip>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "dateUploaded",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date Uploaded" />,
    cell: ({ row }) => format(row.original.dateUploaded, "MM/dd/yyyy h:mm a"),
    enableSorting: true,
  },
  {
    accessorKey: "lastUpdated",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
    cell: ({ row }) => format(row.original.lastUpdated, "MM/dd/yyyy h:mm a"),
    enableSorting: true,
  },
  {
    accessorKey: "sharedWith",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Shared With" />,
    cell: ({ row }) => (
      <Badge className="bg-gray-100 text-gray-800 whitespace-nowrap">{row.original.sharedWith}</Badge>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => alert("Edit metadata for " + row.original.name)}>
            <Edit className="h-4 w-4 mr-2" /> Edit Metadata
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert("Change visibility for " + row.original.name)}>
            <Share2 className="h-4 w-4 mr-2" /> Change Visibility
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert("Download " + row.original.name)}>
            <Download className="h-4 w-4 mr-2" /> Download
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert("Delete " + row.original.name)} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => alert("View access log for " + row.original.name)}>
            <Eye className="h-4 w-4 mr-2" /> View Access Log
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
  },
]

export default function DocumentsPage() {
  const [data] = useState(demoDocuments)
  const [category, setCategory] = useState<string>("all")
  const [attachedTo, setAttachedTo] = useState<string>("all")
  const [owner, setOwner] = useState<string>("all")
  const [sharedWith, setSharedWith] = useState<string>("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [docName, setDocName] = useState("")
  const [selectedBuildings, setSelectedBuildings] = useState<string[]>([])
  const [selectedTenants, setSelectedTenants] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<string[]>([])
  const [shareAllTenantUsers, setShareAllTenantUsers] = useState(true)
  const [shareAllTenantAdmins, setShareAllTenantAdmins] = useState(true)
  const [shareAllVendors, setShareAllVendors] = useState(true)
  const [shareSpecificTenants, setShareSpecificTenants] = useState<string[]>([])
  const [shareSpecificVendors, setShareSpecificVendors] = useState<string[]>([])

  // Demo options
  const buildingOptions = ["Building A", "Building B", "Building C"]
  const tenantOptions = ["ACME Corp", "Segment"]
  const typeOptions = ["Lease", "COI", "Compliance", "Policy", "Other"]
  const vendorOptions = ["CleanCo"]

  // Helper for multi-select popover
  function MultiSelectPopover({ label, options, selected, setSelected, placeholder }: { label: string, options: string[], selected: string[], setSelected: (v: string[]) => void, placeholder?: string }) {
    const [popoverOpen, setPopoverOpen] = useState(false)
    return (
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between h-12 px-4 rounded-md text-base border bg-background">
            <span className="truncate text-left">{selected.length ? selected.join(", ") : placeholder || `Select ${label}`}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-64">
          <Command>
            <CommandInput placeholder={`Search by ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    onSelect={() => {
                      setSelected(
                        selected.includes(option)
                          ? selected.filter((v) => v !== option)
                          : [...selected, option]
                      )
                    }}
                  >
                    <Checkbox checked={selected.includes(option)} className="mr-2" />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  const filtered = data.filter((doc) => {
    const cat = category === "all" || doc.category === category
    const att = attachedTo === "all" || doc.attachedTo.type === attachedTo
    const own = owner === "all" || doc.owner === owner
    const shw = sharedWith === "all" || doc.sharedWith === sharedWith
    const date = !dateRange || (
      (!dateRange.from || doc.dateUploaded >= dateRange.from) &&
      (!dateRange.to || doc.dateUploaded <= dateRange.to)
    )
    return cat && att && own && shw && date
  })

  // Add ShareWithDropdown component and supporting state
  const shareWithOptions = [
    { label: "All Tenant Users", value: "all-tenant-users" },
    { label: "All Tenant Admins", value: "all-tenant-admins" },
    { label: "All Vendors", value: "all-vendors" },
    { label: "Specific Tenant(s)", value: "specific-tenants" },
    { label: "Specific Vendor(s)", value: "specific-vendors" },
  ]
  const [shareWith, setShareWith] = useState<string[]>([])

  function ShareWithDropdown({ tenantOptions, vendorOptions, value, setValue }: { tenantOptions: string[], vendorOptions: string[], value: string[], setValue: (v: string[]) => void }) {
    const [specificTenants, setSpecificTenants] = useState<string[]>([])
    const [specificVendors, setSpecificVendors] = useState<string[]>([])
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between flex-wrap min-h-10">
            <div className="flex flex-wrap gap-1">
              {shareWithOptions.filter(opt => value.includes(opt.value)).map(opt => (
                <Badge key={opt.value} className="bg-gray-100 text-gray-800">{opt.label}</Badge>
              ))}
              {value.includes("specific-tenants") && specificTenants.length > 0 && (
                specificTenants.map(t => <Badge key={t} className="bg-blue-100 text-blue-800">{t}</Badge>)
              )}
              {value.includes("specific-vendors") && specificVendors.length > 0 && (
                specificVendors.map(v => <Badge key={v} className="bg-yellow-100 text-yellow-800">{v}</Badge>)
              )}
              {value.length === 0 && <span className="text-gray-400">Select who to share with</span>}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-72">
          <Command>
            <CommandInput placeholder="Search share options..." />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {shareWithOptions.map(opt => (
                  <CommandItem
                    key={opt.value}
                    onSelect={() => {
                      if (value.includes(opt.value)) {
                        setValue(value.filter(v => v !== opt.value))
                      } else {
                        setValue([...value, opt.value])
                      }
                    }}
                  >
                    <Checkbox checked={value.includes(opt.value)} className="mr-2" />
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              {value.includes("specific-tenants") && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Select Tenants">
                    {tenantOptions.map(t => (
                      <CommandItem
                        key={t}
                        onSelect={() => {
                          setSpecificTenants(
                            specificTenants.includes(t)
                              ? specificTenants.filter(x => x !== t)
                              : [...specificTenants, t]
                          )
                        }}
                      >
                        <Checkbox checked={specificTenants.includes(t)} className="mr-2" />
                        {t}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
              {value.includes("specific-vendors") && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Select Vendors">
                    {vendorOptions.map(v => (
                      <CommandItem
                        key={v}
                        onSelect={() => {
                          setSpecificVendors(
                            specificVendors.includes(v)
                              ? specificVendors.filter(x => x !== v)
                              : [...specificVendors, v]
                          )
                        }}
                      >
                        <Checkbox checked={specificVendors.includes(v)} className="mr-2" />
                        {v}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-4">
          <div className="page-header">
            <div>
              <h1 className="page-title">Documents</h1>
              <p className="page-subtitle">Store, organize, and share important building documents and files</p>
            </div>
            <div className="flex items-center space-x-4">
              <GlobalSearch />
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl w-full p-0 max-h-[90vh] overflow-y-auto">
                  <Card className="border-none shadow-none">
                    <CardHeader className="pb-2">
                      <DialogTitle>Add Document</DialogTitle>
                      <DialogDescription>Upload a new document and set sharing options.</DialogDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* File Uploader */}
                        <div className="col-span-1 md:col-span-2">
                          <Label htmlFor="file-upload">Document File</Label>
                          <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                            <Input
                              id="file-upload"
                              type="file"
                              className="hidden"
                              onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                            />
                            <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer w-full">
                              <Upload className="h-8 w-8 text-blue-500 mb-2" />
                              <span className="text-sm text-gray-600">{selectedFile ? selectedFile.name : "Drag & drop or click to upload"}</span>
                            </label>
                          </div>
                        </div>
                        {/* Document Name and Type aligned in same row */}
                        <div>
                          <Label htmlFor="doc-name">Document Name</Label>
                          <Input id="doc-name" value={docName} onChange={e => setDocName(e.target.value)} placeholder="Enter document name" className="mt-2" />
                        </div>
                        <div>
                          <Label>Type</Label>
                          <MultiSelectPopover label="Type" options={typeOptions} selected={selectedType} setSelected={setSelectedType} placeholder="Select type(s)" />
                        </div>
                        {/* Building Multi-Select */}
                        <div>
                          <Label>Building</Label>
                          <MultiSelectPopover label="Building" options={buildingOptions} selected={selectedBuildings} setSelected={setSelectedBuildings} placeholder="Select building(s)" />
                        </div>
                        {/* Tenant Multi-Select */}
                        <div>
                          <Label>Tenant</Label>
                          <MultiSelectPopover label="Tenant" options={tenantOptions} selected={selectedTenants} setSelected={setSelectedTenants} placeholder="Select tenant(s)" />
                        </div>
                        {/* Share With Consolidated Dropdown */}
                        <div className="col-span-1 md:col-span-2">
                          <Label>Share With</Label>
                          <ShareWithDropdown
                            tenantOptions={tenantOptions}
                            vendorOptions={vendorOptions}
                            value={shareWith}
                            setValue={setShareWith}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <DialogFooter className="flex-row justify-end gap-2 p-4 border-t bg-gray-50">
                      <DialogClose asChild>
                        <Button variant="ghost" type="button">Cancel</Button>
                      </DialogClose>
                      <Button type="button" className="bg-blue-600 hover:bg-blue-700">Add Document</Button>
                    </DialogFooter>
                  </Card>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="page-container">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <h3 className="text-lg font-medium">All Documents ({filtered.length})</h3>
                  <div className="flex flex-wrap gap-2 items-center px-1 py-1 bg-white rounded-md shadow-sm">
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-32"><SelectValue placeholder="Category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Lease">Lease</SelectItem>
                        <SelectItem value="COI">COI</SelectItem>
                        <SelectItem value="Compliance">Compliance</SelectItem>
                        <SelectItem value="Policy">Policy</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={attachedTo} onValueChange={setAttachedTo}>
                      <SelectTrigger className="w-32"><SelectValue placeholder="Attached To" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Attached</SelectItem>
                        <SelectItem value="Tenant">Tenant</SelectItem>
                        <SelectItem value="Vendor">Vendor</SelectItem>
                        <SelectItem value="Internal">Internal</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={owner} onValueChange={setOwner}>
                      <SelectTrigger className="w-28"><SelectValue placeholder="Owner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Owners</SelectItem>
                        <SelectItem value="Landlord">Landlord</SelectItem>
                        <SelectItem value="Tenant">Tenant</SelectItem>
                        <SelectItem value="Vendor">Vendor</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sharedWith} onValueChange={setSharedWith}>
                      <SelectTrigger className="w-44"><SelectValue placeholder="Shared With" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Visibility</SelectItem>
                        <SelectItem value="All Tenant Admins">🟢 All Tenant Admins</SelectItem>
                        <SelectItem value="Specific Tenant Admins">🟡 Specific Tenant Admins</SelectItem>
                        <SelectItem value="All Admins & Users">🔷 All Admins & Users</SelectItem>
                        <SelectItem value="Everyone">🌐 Everyone</SelectItem>
                        <SelectItem value="Internal Only">🔒 Internal Only</SelectItem>
                      </SelectContent>
                    </Select>
                    <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable columns={columns} data={filtered} searchKey="name" searchPlaceholder="Search by document name..." />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 
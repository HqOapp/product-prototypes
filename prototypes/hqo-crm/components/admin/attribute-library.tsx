"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"

interface AttributeType {
  id: string
  name: string
  type: string
  description: string
  objects: string[]
  options?: string[]
  validation?: string
  required: boolean
}

const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Text Area" },
  { value: "number", label: "Number" },
  { value: "currency", label: "Currency" },
  { value: "percentage", label: "Percentage" },
  { value: "date", label: "Date" },
  { value: "datetime", label: "Date & Time" },
  { value: "dropdown", label: "Dropdown" },
  { value: "multiselect", label: "Multi-Select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio Button" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "url", label: "URL" },
  { value: "file", label: "File Upload" },
]

export function AttributeLibrary() {
  const [attributes, setAttributes] = useState<AttributeType[]>([
    {
      id: "company_name",
      name: "Company Name",
      type: "text",
      description: "The legal name of the company",
      objects: ["tenants", "vendors"],
      required: true,
    },
    {
      id: "industry",
      name: "Industry",
      type: "dropdown",
      description: "The industry the company operates in",
      objects: ["tenants"],
      options: ["Technology", "Healthcare", "Finance", "Retail", "Manufacturing", "Other"],
      required: true,
    },
    {
      id: "employees",
      name: "Number of Employees",
      type: "number",
      description: "Total employee count",
      objects: ["tenants"],
      required: false,
    },
    {
      id: "annual_revenue",
      name: "Annual Revenue",
      type: "currency",
      description: "Annual company revenue",
      objects: ["tenants"],
      required: false,
    },
    {
      id: "founded_date",
      name: "Founded Date",
      type: "date",
      description: "When the company was founded",
      objects: ["tenants"],
      required: false,
    },
    {
      id: "lease_expiration",
      name: "Lease Expiration",
      type: "date",
      description: "When the lease expires",
      objects: ["tenants"],
      required: true,
    },
    {
      id: "square_footage",
      name: "Square Footage",
      type: "number",
      description: "Total leased area in square feet",
      objects: ["tenants"],
      required: true,
    },
    {
      id: "service_type",
      name: "Service Type",
      type: "dropdown",
      description: "Type of service provided",
      objects: ["vendors"],
      options: ["Maintenance", "Cleaning", "Security", "IT", "Catering", "Other"],
      required: true,
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAttribute, setNewAttribute] = useState<Partial<AttributeType>>({
    name: "",
    type: "text",
    description: "",
    objects: [],
    required: false,
  })

  const filteredAttributes = attributes.filter((attr) => {
    const matchesSearch =
      attr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attr.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = !selectedType || selectedType === "all" || attr.type === selectedType
    return matchesSearch && matchesType
  })

  const handleAddAttribute = () => {
    if (newAttribute.name && newAttribute.type) {
      const id = newAttribute.name.toLowerCase().replace(/\s+/g, "_")
      const attribute: AttributeType = {
        id,
        name: newAttribute.name,
        type: newAttribute.type,
        description: newAttribute.description || "",
        objects: newAttribute.objects || [],
        required: newAttribute.required || false,
      }

      if (["dropdown", "multiselect", "radio"].includes(newAttribute.type) && newAttribute.options) {
        attribute.options = newAttribute.options
      }

      setAttributes([...attributes, attribute])
      setNewAttribute({
        name: "",
        type: "text",
        description: "",
        objects: [],
        required: false,
      })
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Attribute Library</h1>
          <p className="text-gray-500">Manage all field types and attributes across your CRM</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Attribute
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Attribute</DialogTitle>
              <DialogDescription>Define a new attribute that can be added to objects in your CRM</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Attribute Name</Label>
                <Input
                  id="name"
                  value={newAttribute.name || ""}
                  onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
                  placeholder="e.g. Annual Revenue, Employee Count"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Field Type</Label>
                <Select
                  value={newAttribute.type}
                  onValueChange={(value) => setNewAttribute({ ...newAttribute, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newAttribute.description || ""}
                  onChange={(e) => setNewAttribute({ ...newAttribute, description: e.target.value })}
                  placeholder="Describe the purpose of this attribute"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="required"
                  checked={newAttribute.required || false}
                  onCheckedChange={(checked) => setNewAttribute({ ...newAttribute, required: checked })}
                />
                <Label htmlFor="required">Required Field</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAttribute}>Create Attribute</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search attributes..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={selectedType || "all"}
            onValueChange={(value) => setSelectedType(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All field types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All field types</SelectItem>
              {fieldTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Attributes</TabsTrigger>
            <TabsTrigger value="tenants">Tenant Attributes</TabsTrigger>
            <TabsTrigger value="buildings">Building Attributes</TabsTrigger>
            <TabsTrigger value="vendors">Vendor Attributes</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="divide-y">
                  {filteredAttributes.length > 0 ? (
                    filteredAttributes.map((attr) => (
                      <div key={attr.id} className="py-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{attr.name}</span>
                            {attr.required && (
                              <Badge variant="secondary" className="ml-2">
                                Required
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">{attr.description}</div>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="mr-2">
                              {fieldTypes.find((t) => t.value === attr.type)?.label || attr.type}
                            </Badge>
                            {attr.objects.map((obj) => (
                              <Badge key={obj} variant="outline" className="mr-2">
                                {obj}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-500">No attributes found matching your criteria</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tenants" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="divide-y">
                  {attributes
                    .filter((attr) => attr.objects.includes("tenants"))
                    .map((attr) => (
                      <div key={attr.id} className="py-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{attr.name}</span>
                            {attr.required && (
                              <Badge variant="secondary" className="ml-2">
                                Required
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">{attr.description}</div>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline">
                              {fieldTypes.find((t) => t.value === attr.type)?.label || attr.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Similar content for other tabs */}
        </Tabs>
      </div>
    </div>
  )
}

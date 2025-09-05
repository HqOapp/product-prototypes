"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Plus, GripVertical, Layout, Columns, PanelRight, Trash2, Edit } from "lucide-react"

interface TemplateType {
  id: string
  name: string
  description: string
  objectType: string
  tabs: TabType[]
  defaultTab: string
}

interface TabType {
  id: string
  name: string
  layout: "standard" | "two-column" | "three-column"
  sections: SectionType[]
}

interface SectionType {
  id: string
  name: string
  type: "fields" | "related" | "activity" | "custom"
  position: "main" | "sidebar"
  fields?: string[]
}

export function PageTemplates() {
  const [templates, setTemplates] = useState<TemplateType[]>([
    {
      id: "tenant_default",
      name: "Tenant Default",
      description: "Default template for tenant objects",
      objectType: "tenants",
      tabs: [
        {
          id: "overview",
          name: "Overview",
          layout: "two-column",
          sections: [
            {
              id: "company_info",
              name: "Company Information",
              type: "fields",
              position: "main",
              fields: ["company_name", "industry", "employees", "founded_date"],
            },
            {
              id: "lease_summary",
              name: "Lease Summary",
              type: "fields",
              position: "main",
              fields: ["square_footage", "lease_expiration"],
            },
            {
              id: "key_contacts",
              name: "Key Contacts",
              type: "related",
              position: "sidebar",
            },
            {
              id: "tenant_health",
              name: "Tenant Health",
              type: "custom",
              position: "sidebar",
            },
          ],
        },
        {
          id: "lease_docs",
          name: "Lease & Docs",
          layout: "two-column",
          sections: [
            {
              id: "lease_details",
              name: "Lease Details",
              type: "fields",
              position: "main",
            },
            {
              id: "documents",
              name: "Documents",
              type: "custom",
              position: "sidebar",
            },
          ],
        },
        {
          id: "contacts",
          name: "Contacts",
          layout: "standard",
          sections: [
            {
              id: "contacts_list",
              name: "Contacts",
              type: "related",
              position: "main",
            },
          ],
        },
        {
          id: "activity",
          name: "Activity",
          layout: "two-column",
          sections: [
            {
              id: "activity_feed",
              name: "Activity Feed",
              type: "activity",
              position: "main",
            },
            {
              id: "activity_summary",
              name: "Activity Summary",
              type: "custom",
              position: "sidebar",
            },
          ],
        },
      ],
      defaultTab: "overview",
    },
    {
      id: "building_default",
      name: "Building Default",
      description: "Default template for building objects",
      objectType: "buildings",
      tabs: [
        {
          id: "overview",
          name: "Overview",
          layout: "two-column",
          sections: [
            {
              id: "building_info",
              name: "Building Information",
              type: "fields",
              position: "main",
            },
            {
              id: "occupancy",
              name: "Occupancy",
              type: "custom",
              position: "sidebar",
            },
          ],
        },
      ],
      defaultTab: "overview",
    },
  ])

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null)
  const [selectedTab, setSelectedTab] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    objectType: "tenants",
  })

  const handleAddTemplate = () => {
    if (newTemplate.name) {
      const id = newTemplate.name.toLowerCase().replace(/\s+/g, "_")
      const template: TemplateType = {
        id,
        name: newTemplate.name,
        description: newTemplate.description,
        objectType: newTemplate.objectType,
        tabs: [
          {
            id: "overview",
            name: "Overview",
            layout: "standard",
            sections: [
              {
                id: "main_section",
                name: "Main Section",
                type: "fields",
                position: "main",
              },
            ],
          },
        ],
        defaultTab: "overview",
      }

      setTemplates([...templates, template])
      setNewTemplate({
        name: "",
        description: "",
        objectType: "tenants",
      })
      setIsDialogOpen(false)
    }
  }

  const handleTabDragEnd = (result: any) => {
    if (!result.destination || !selectedTemplate) return

    const tabs = Array.from(selectedTemplate.tabs)
    const [reorderedItem] = tabs.splice(result.source.index, 1)
    tabs.splice(result.destination.index, 0, reorderedItem)

    setSelectedTemplate({
      ...selectedTemplate,
      tabs,
    })

    // Update the template in the main templates array
    setTemplates(templates.map((template) => (template.id === selectedTemplate.id ? { ...template, tabs } : template)))
  }

  const handleSectionDragEnd = (result: any) => {
    if (!result.destination || !selectedTemplate || !selectedTab) return

    const currentTab = selectedTemplate.tabs.find((tab) => tab.id === selectedTab)
    if (!currentTab) return

    const sections = Array.from(currentTab.sections)
    const [reorderedItem] = sections.splice(result.source.index, 1)
    sections.splice(result.destination.index, 0, reorderedItem)

    const updatedTabs = selectedTemplate.tabs.map((tab) => (tab.id === selectedTab ? { ...tab, sections } : tab))

    setSelectedTemplate({
      ...selectedTemplate,
      tabs: updatedTabs,
    })

    // Update the template in the main templates array
    setTemplates(
      templates.map((template) =>
        template.id === selectedTemplate.id ? { ...template, tabs: updatedTabs } : template,
      ),
    )
  }

  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case "standard":
        return <Layout className="h-4 w-4" />
      case "two-column":
        return <Columns className="h-4 w-4" />
      case "three-column":
        return <PanelRight className="h-4 w-4" />
      default:
        return <Layout className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Page Templates</h1>
          <p className="text-gray-500">Configure how object pages are displayed in your CRM</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>Create a new page template for displaying object data</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="e.g. Tenant Detail, Building Overview"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="Describe the purpose of this template"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="objectType">Object Type</Label>
                <Select
                  value={newTemplate.objectType}
                  onValueChange={(value) => setNewTemplate({ ...newTemplate, objectType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select object type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tenants">Tenants</SelectItem>
                    <SelectItem value="buildings">Buildings</SelectItem>
                    <SelectItem value="vendors">Vendors</SelectItem>
                    <SelectItem value="transactions">Transactions</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTemplate}>Create Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Templates List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Templates</CardTitle>
            <CardDescription>Select a template to configure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 border rounded-md cursor-pointer ${
                    selectedTemplate?.id === template.id ? "border-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => {
                    setSelectedTemplate(template)
                    setSelectedTab(template.tabs[0].id)
                  }}
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                  <div className="flex items-center mt-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{template.objectType}</span>
                    <span className="text-xs text-gray-500 ml-2">{template.tabs.length} tabs</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Template Editor */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{selectedTemplate ? `Edit ${selectedTemplate.name}` : "Template Editor"}</CardTitle>
            <CardDescription>
              {selectedTemplate
                ? "Configure tabs, layouts, and sections"
                : "Select a template from the list to begin editing"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedTemplate ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Tabs</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tab
                  </Button>
                </div>

                <DragDropContext onDragEnd={handleTabDragEnd}>
                  <Droppable droppableId="tabs" direction="horizontal">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex space-x-2 overflow-x-auto pb-2"
                      >
                        {selectedTemplate.tabs.map((tab, index) => (
                          <Draggable key={tab.id} draggableId={tab.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`flex items-center space-x-1 px-3 py-2 border rounded-md whitespace-nowrap ${
                                  selectedTab === tab.id ? "border-blue-500 bg-blue-50" : ""
                                }`}
                                onClick={() => setSelectedTab(tab.id)}
                              >
                                <GripVertical className="h-4 w-4 text-gray-400" />
                                <span>{tab.name}</span>
                                {getLayoutIcon(tab.layout)}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {selectedTab && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Layout</h3>
                      <Select
                        value={selectedTemplate.tabs.find((t) => t.id === selectedTab)?.layout || "standard"}
                        onValueChange={(value) => {
                          const updatedTabs = selectedTemplate.tabs.map((tab) =>
                            tab.id === selectedTab ? { ...tab, layout: value as any } : tab,
                          )

                          setSelectedTemplate({
                            ...selectedTemplate,
                            tabs: updatedTabs,
                          })

                          setTemplates(
                            templates.map((template) =>
                              template.id === selectedTemplate.id ? { ...template, tabs: updatedTabs } : template,
                            ),
                          )
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="two-column">Two Column</SelectItem>
                          <SelectItem value="three-column">Three Column</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Sections</h3>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Section
                        </Button>
                      </div>

                      <DragDropContext onDragEnd={handleSectionDragEnd}>
                        <Droppable droppableId="sections">
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                              {selectedTemplate.tabs
                                .find((tab) => tab.id === selectedTab)
                                ?.sections.map((section, index) => (
                                  <Draggable key={section.id} draggableId={section.id} index={index}>
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className="flex items-center justify-between p-3 bg-white border rounded-md"
                                      >
                                        <div className="flex items-center">
                                          <div {...provided.dragHandleProps} className="mr-2 cursor-move">
                                            <GripVertical className="h-5 w-5 text-gray-400" />
                                          </div>
                                          <div>
                                            <div className="font-medium">{section.name}</div>
                                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2">
                                                {section.type}
                                              </span>
                                              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                {section.position}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Button variant="ghost" size="sm">
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="sm">
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <Layout className="h-10 w-10 mb-2" />
                <p>Select a template to configure</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

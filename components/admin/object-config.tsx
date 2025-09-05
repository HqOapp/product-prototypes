"use client"

import type React from "react"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Building2, Users, Truck, CreditCard, UserCheck, GripVertical, Plus, Settings, Trash2 } from "lucide-react"

interface ObjectType {
  id: string
  name: string
  icon: React.ElementType
  enabled: boolean
  isDefault: boolean
  fields: FieldType[]
}

interface FieldType {
  id: string
  name: string
  type: string
  required: boolean
  order: number
}

export function ObjectConfig() {
  const [objects, setObjects] = useState<ObjectType[]>([
    {
      id: "buildings",
      name: "Buildings",
      icon: Building2,
      enabled: true,
      isDefault: true,
      fields: [
        { id: "name", name: "Name", type: "text", required: true, order: 0 },
        { id: "address", name: "Address", type: "text", required: true, order: 1 },
        { id: "city", name: "City", type: "text", required: true, order: 2 },
        { id: "state", name: "State", type: "text", required: true, order: 3 },
        { id: "zip", name: "ZIP", type: "text", required: true, order: 4 },
      ],
    },
    {
      id: "tenants",
      name: "Tenants",
      icon: Users,
      enabled: true,
      isDefault: true,
      fields: [
        { id: "company_name", name: "Company Name", type: "text", required: true, order: 0 },
        { id: "industry", name: "Industry", type: "dropdown", required: true, order: 1 },
        { id: "employees", name: "Employees", type: "number", required: false, order: 2 },
        { id: "founded", name: "Founded", type: "date", required: false, order: 3 },
      ],
    },
    {
      id: "vendors",
      name: "Vendors",
      icon: Truck,
      enabled: true,
      isDefault: true,
      fields: [
        { id: "vendor_name", name: "Vendor Name", type: "text", required: true, order: 0 },
        { id: "service_type", name: "Service Type", type: "dropdown", required: true, order: 1 },
      ],
    },
    {
      id: "transactions",
      name: "Transactions",
      icon: CreditCard,
      enabled: true,
      isDefault: true,
      fields: [
        { id: "amount", name: "Amount", type: "currency", required: true, order: 0 },
        { id: "date", name: "Date", type: "date", required: true, order: 1 },
        { id: "type", name: "Type", type: "dropdown", required: true, order: 2 },
      ],
    },
    {
      id: "users",
      name: "Users",
      icon: UserCheck,
      enabled: true,
      isDefault: true,
      fields: [
        { id: "first_name", name: "First Name", type: "text", required: true, order: 0 },
        { id: "last_name", name: "Last Name", type: "text", required: true, order: 1 },
        { id: "email", name: "Email", type: "email", required: true, order: 2 },
        { id: "role", name: "Role", type: "dropdown", required: true, order: 3 },
      ],
    },
  ])

  const [newObjectName, setNewObjectName] = useState("")
  const [selectedObject, setSelectedObject] = useState<ObjectType | null>(objects[0]) // Auto-select first object
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const toggleObjectEnabled = (id: string) => {
    setObjects(objects.map((obj) => (obj.id === id ? { ...obj, enabled: !obj.enabled } : obj)))
  }

  const handleAddObject = () => {
    if (newObjectName.trim()) {
      const newId = newObjectName.toLowerCase().replace(/\s+/g, "_")
      const newObject: ObjectType = {
        id: newId,
        name: newObjectName,
        icon: Building2, // Default icon
        enabled: true,
        isDefault: false,
        fields: [{ id: `${newId}_name`, name: "Name", type: "text", required: true, order: 0 }],
      }
      setObjects([...objects, newObject])
      setNewObjectName("")
      setIsDialogOpen(false)
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(objects)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setObjects(items)
  }

  const handleFieldDragEnd = (result: any) => {
    if (!result.destination || !selectedObject) return

    const fields = Array.from(selectedObject.fields)
    const [reorderedItem] = fields.splice(result.source.index, 1)
    fields.splice(result.destination.index, 0, reorderedItem)

    // Update order values
    const updatedFields = fields.map((field, index) => ({
      ...field,
      order: index,
    }))

    setSelectedObject({
      ...selectedObject,
      fields: updatedFields,
    })

    // Update the object in the main objects array
    setObjects(objects.map((obj) => (obj.id === selectedObject.id ? { ...obj, fields: updatedFields } : obj)))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Object Configuration</h1>
          <p className="text-gray-500">Manage your CRM objects and their fields</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Object
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Object</DialogTitle>
              <DialogDescription>
                Add a new custom object to your CRM. This will create a new section in the navigation.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newObjectName}
                  onChange={(e) => setNewObjectName(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g. Projects, Deals, Properties"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddObject}>Create Object</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Layout - Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Objects List */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Objects</CardTitle>
              <CardDescription>Enable or disable objects and drag to reorder them in the navigation</CardDescription>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="objects">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {objects.map((object, index) => (
                        <Draggable key={object.id} draggableId={object.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedObject?.id === object.id 
                                  ? 'bg-blue-50 border-blue-200' 
                                  : 'bg-white hover:bg-gray-50'
                              }`}
                              onClick={() => setSelectedObject(object)}
                            >
                              <div className="flex items-center">
                                <div {...provided.dragHandleProps} className="mr-2 cursor-move" onClick={(e) => e.stopPropagation()}>
                                  <GripVertical className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="flex items-center">
                                  <object.icon className="h-5 w-5 mr-2 text-gray-500" />
                                  <span>{object.name}</span>
                                  {object.isDefault && (
                                    <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                                      Default
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  checked={object.enabled} 
                                  onCheckedChange={() => toggleObjectEnabled(object.id)} 
                                  onClick={(e) => e.stopPropagation()}
                                />
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
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Field Configuration */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{selectedObject ? `${selectedObject.name} Fields` : "Field Configuration"}</CardTitle>
              <CardDescription>
                {selectedObject
                  ? "Drag and drop to reorder fields or edit their properties"
                  : "Select an object to configure its fields"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedObject ? (
                <div className="space-y-4">
                  <DragDropContext onDragEnd={handleFieldDragEnd}>
                    <Droppable droppableId="fields">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                          {selectedObject.fields.map((field, index) => (
                            <Draggable key={field.id} draggableId={field.id} index={index}>
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
                                      <div className="font-medium">{field.name}</div>
                                      <div className="text-xs text-gray-500">
                                        Type: {field.type} {field.required && "• Required"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm">
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                    {!field.required && (
                                      <Button variant="ghost" size="sm">
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    )}
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
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                  <Settings className="h-10 w-10 mb-2" />
                  <p>Select an object to configure its fields</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

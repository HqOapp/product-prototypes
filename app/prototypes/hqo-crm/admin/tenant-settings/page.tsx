"use client"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { useState } from "react"

interface Substage {
  name: string
  enabled: boolean
  workOrders: WorkOrderConfig[]
}

interface WorkOrderConfig {
  id: string
  type: string
  title: string
  priority: 'low' | 'medium' | 'high'
  autoAssign: boolean
}

interface LifecycleStage {
  name: string
  duration: number
  enabled: boolean
  color: string
  timeLimit?: number
  criteria: StageCriteria[]
}

interface StageCriteria {
  id: string
  name: string
  required: boolean
  completed: boolean
}

const initialStages: LifecycleStage[] = [
  { 
    name: "Pre-Lease", 
    duration: 5, 
    enabled: true, 
    color: "#3B82F6", 
    timeLimit: 30,
    criteria: [
      { id: "1", name: "Prospect identified", required: true, completed: false },
      { id: "2", name: "Initial contact made", required: true, completed: false },
      { id: "3", name: "Needs assessment completed", required: false, completed: false }
    ]
  },
  { 
    name: "Negotiation", 
    duration: 3, 
    enabled: true, 
    color: "#8B5CF6", 
    timeLimit: 14,
    criteria: [
      { id: "4", name: "Initial proposal sent", required: true, completed: false },
      { id: "5", name: "Terms negotiated", required: true, completed: false },
      { id: "6", name: "Final offer approved", required: true, completed: false }
    ]
  },
  { 
    name: "Sign Off", 
    duration: 3, 
    enabled: true, 
    color: "#F59E0B", 
    timeLimit: 7,
    criteria: [
      { id: "7", name: "Legal review completed", required: true, completed: false },
      { id: "8", name: "Contract signed", required: true, completed: false },
      { id: "9", name: "Deposit received", required: true, completed: false }
    ]
  },
  { 
    name: "Fit Out", 
    duration: 7, 
    enabled: true, 
    color: "#10B981", 
    timeLimit: 60,
    criteria: [
      { id: "10", name: "Space planning approved", required: true, completed: false },
      { id: "11", name: "Construction permits obtained", required: true, completed: false },
      { id: "12", name: "Fit out completed", required: true, completed: false }
    ]
  },
  { 
    name: "Onboarding", 
    duration: 6, 
    enabled: true, 
    color: "#06B6D4", 
    timeLimit: 14,
    criteria: [
      { id: "13", name: "Access cards issued", required: true, completed: false },
      { id: "14", name: "System setup completed", required: true, completed: false },
      { id: "15", name: "Welcome package delivered", required: false, completed: false }
    ]
  },
  { 
    name: "Active", 
    duration: 4, 
    enabled: true, 
    color: "#22C55E", 
    timeLimit: 0,
    criteria: [
      { id: "16", name: "Regular check-ins scheduled", required: false, completed: false },
      { id: "17", name: "Satisfaction survey sent", required: false, completed: false }
    ]
  },
  { 
    name: "Renewal / Exit", 
    duration: 6, 
    enabled: true, 
    color: "#EF4444", 
    timeLimit: 90,
    criteria: [
      { id: "18", name: "Renewal discussion initiated", required: true, completed: false },
      { id: "19", name: "Exit procedures completed", required: false, completed: false }
    ]
  },
]

// Work order types
const workOrderTypes = [
  { value: "maintenance", label: "Maintenance" },
  { value: "construction", label: "Construction" },
  { value: "it-setup", label: "IT Setup" },
  { value: "cleaning", label: "Cleaning" },
  { value: "security", label: "Security" },
  { value: "inspection", label: "Inspection" },
  { value: "delivery", label: "Delivery" },
  { value: "administrative", label: "Administrative" },
  { value: "other", label: "Other" },
]

const initialSubstages: Record<string, Substage[]> = {
  "Pre-Lease": [
    { name: "Prospect identified", enabled: true, workOrders: [] },
    { name: "Broker assigned", enabled: true, workOrders: [] },
    { name: "Space of interest selected", enabled: true, workOrders: [] },
    { name: "Tour scheduled and completed", enabled: true, workOrders: [
      { id: "1", type: "cleaning", title: "Pre-tour space cleaning", priority: "medium", autoAssign: true }
    ] },
    { name: "Feedback collected", enabled: true, workOrders: [] },
  ],
  "Negotiation": [
    { name: "Initial proposal", enabled: true, workOrders: [] },
    { name: "Counteroffers", enabled: true, workOrders: [] },
    { name: "Terms discussion", enabled: true, workOrders: [] },
  ],
  "Sign Off": [
    { name: "Final review", enabled: true, workOrders: [] },
    { name: "Legal approval", enabled: true, workOrders: [] },
    { name: "Signatures collected", enabled: true, workOrders: [
      { id: "2", type: "administrative", title: "Process signed documents", priority: "high", autoAssign: false }
    ] },
  ],
  "Fit Out": [
    { name: "Construction or modifications initiated", enabled: true, workOrders: [
      { id: "3", type: "construction", title: "Begin fit-out construction", priority: "high", autoAssign: true }
    ] },
    { name: "Permit approvals and inspections", enabled: true, workOrders: [
      { id: "4", type: "inspection", title: "Schedule building inspection", priority: "high", autoAssign: false }
    ] },
    { name: "AV and IT planning", enabled: true, workOrders: [] },
    { name: "Furniture procurement and delivery", enabled: true, workOrders: [
      { id: "5", type: "delivery", title: "Coordinate furniture delivery", priority: "medium", autoAssign: false }
    ] },
    { name: "Signage design and installation", enabled: true, workOrders: [] },
    { name: "Internet and cabling installation", enabled: true, workOrders: [
      { id: "6", type: "it-setup", title: "Install network infrastructure", priority: "high", autoAssign: true }
    ] },
    { name: "Certificate of Occupancy secured", enabled: true, workOrders: [] },
  ],
  "Onboarding": [
    { name: "Admin user set up in tenant platform", enabled: true, workOrders: [
      { id: "7", type: "it-setup", title: "Configure tenant admin access", priority: "high", autoAssign: true }
    ] },
    { name: "App user invites sent", enabled: true, workOrders: [] },
    { name: "Building access granted", enabled: true, workOrders: [
      { id: "8", type: "security", title: "Issue access cards", priority: "high", autoAssign: true }
    ] },
    { name: "Systems configured", enabled: true, workOrders: [] },
    { name: "Welcome kit and orientation material shared", enabled: true, workOrders: [
      { id: "9", type: "delivery", title: "Deliver welcome package", priority: "low", autoAssign: false }
    ] },
    { name: "Introductory events held", enabled: true, workOrders: [] },
  ],
  "Active": [
    { name: "Monitor experience", enabled: true, workOrders: [] },
    { name: "Issue utilization and engagement reports", enabled: true, workOrders: [] },
    { name: "Deliver service-level KPIs", enabled: true, workOrders: [] },
    { name: "Conduct regular check-ins", enabled: true, workOrders: [] },
  ],
  "Renewal / Exit": [
    { name: "Lease term review", enabled: true, workOrders: [] },
    { name: "Retention strategy deployed", enabled: true, workOrders: [] },
    { name: "Space recovery plan", enabled: true, workOrders: [] },
    { name: "Exit walkthrough", enabled: true, workOrders: [
      { id: "10", type: "inspection", title: "Final space inspection", priority: "high", autoAssign: false }
    ] },
    { name: "Data offboarding", enabled: true, workOrders: [
      { id: "11", type: "it-setup", title: "Remove tenant data access", priority: "high", autoAssign: true }
    ] },
    { name: "Prospect pipeline reactivated", enabled: true, workOrders: [] },
  ],
}

export default function TenantSettingsPage() {
  const [selectedStage, setSelectedStage] = useState("Pre-Lease")
  const [lifecycleStages, setLifecycleStages] = useState<LifecycleStage[]>(initialStages)
  const [stageSubstages, setStageSubstages] = useState<Record<string, Substage[]>>(initialSubstages)
  const [newStageName, setNewStageName] = useState("")
  const [newStageDuration, setNewStageDuration] = useState("")
  const [showAddStageForm, setShowAddStageForm] = useState(false)
  const [newSubstageName, setNewSubstageName] = useState("")
  const [showAddSubstageForm, setShowAddSubstageForm] = useState(false)
  const [newCriteriaName, setNewCriteriaName] = useState("")
  const [showAddCriteriaForm, setShowAddCriteriaForm] = useState(false)
  const [showWorkOrderForm, setShowWorkOrderForm] = useState<number | null>(null)
  const [workOrderForm, setWorkOrderForm] = useState({
    type: "",
    title: "",
    priority: "medium" as 'low' | 'medium' | 'high',
    autoAssign: false
  })

  const currentSubstages = stageSubstages[selectedStage] || []
  const currentStage = lifecycleStages.find(stage => stage.name === selectedStage)

  const handleStageToggle = (stageName: string) => {
    setLifecycleStages(prev => 
      prev.map(stage => 
        stage.name === stageName 
          ? { ...stage, enabled: !stage.enabled }
          : stage
      )
    )
  }

  const handleSubstageToggle = (substageIndex: number) => {
    setStageSubstages(prev => ({
      ...prev,
      [selectedStage]: prev[selectedStage].map((substage, index) =>
        index === substageIndex
          ? { ...substage, enabled: !substage.enabled }
          : substage
      )
    }))
  }

  const handleAddStage = () => {
    if (newStageName.trim() && newStageDuration.trim()) {
      const newStage: LifecycleStage = {
        name: newStageName.trim(),
        duration: parseInt(newStageDuration) || 1,
        enabled: true,
        color: "#6B7280",
        timeLimit: 7,
        criteria: []
      }
      setLifecycleStages(prev => [...prev, newStage])
      setStageSubstages(prev => ({
        ...prev,
        [newStageName.trim()]: []
      }))
      setNewStageName("")
      setNewStageDuration("")
      setShowAddStageForm(false)
    }
  }

  const handleAddSubstage = () => {
    if (newSubstageName.trim()) {
      const newSubstage: Substage = {
        name: newSubstageName.trim(),
        enabled: true,
        workOrders: []
      }
      setStageSubstages(prev => ({
        ...prev,
        [selectedStage]: [...(prev[selectedStage] || []), newSubstage]
      }))
      setNewSubstageName("")
      setShowAddSubstageForm(false)
    }
  }

  const handleDeleteStage = (stageName: string) => {
    setLifecycleStages(prev => prev.filter(stage => stage.name !== stageName))
    setStageSubstages(prev => {
      const newSubstages = { ...prev }
      delete newSubstages[stageName]
      return newSubstages
    })
    if (selectedStage === stageName && lifecycleStages.length > 1) {
      const remainingStages = lifecycleStages.filter(stage => stage.name !== stageName)
      setSelectedStage(remainingStages[0]?.name || "")
    }
  }

  const handleDeleteSubstage = (substageIndex: number) => {
    setStageSubstages(prev => ({
      ...prev,
      [selectedStage]: prev[selectedStage].filter((_, index) => index !== substageIndex)
    }))
  }

  const handleColorChange = (color: string) => {
    setLifecycleStages(prev => 
      prev.map(stage => 
        stage.name === selectedStage 
          ? { ...stage, color }
          : stage
      )
    )
  }

  const handleTimeLimitChange = (timeLimit: number) => {
    setLifecycleStages(prev => 
      prev.map(stage => 
        stage.name === selectedStage 
          ? { ...stage, timeLimit }
          : stage
      )
    )
  }

  const handleCriteriaToggle = (criteriaId: string) => {
    setLifecycleStages(prev => 
      prev.map(stage => 
        stage.name === selectedStage 
          ? { 
              ...stage, 
              criteria: stage.criteria.map(criteria => 
                criteria.id === criteriaId 
                  ? { ...criteria, required: !criteria.required }
                  : criteria
              )
            }
          : stage
      )
    )
  }

  const handleAddCriteria = () => {
    if (newCriteriaName.trim()) {
      const newCriteria: StageCriteria = {
        id: Date.now().toString(),
        name: newCriteriaName.trim(),
        required: true,
        completed: false
      }
      setLifecycleStages(prev => 
        prev.map(stage => 
          stage.name === selectedStage 
            ? { ...stage, criteria: [...stage.criteria, newCriteria] }
            : stage
        )
      )
      setNewCriteriaName("")
      setShowAddCriteriaForm(false)
    }
  }

  const handleDeleteCriteria = (criteriaId: string) => {
    setLifecycleStages(prev => 
      prev.map(stage => 
        stage.name === selectedStage 
          ? { ...stage, criteria: stage.criteria.filter(c => c.id !== criteriaId) }
          : stage
      )
    )
  }

  const handleAddWorkOrder = (substageIndex: number) => {
    if (workOrderForm.type && workOrderForm.title.trim()) {
      const newWorkOrder: WorkOrderConfig = {
        id: Date.now().toString(),
        type: workOrderForm.type,
        title: workOrderForm.title.trim(),
        priority: workOrderForm.priority,
        autoAssign: workOrderForm.autoAssign
      }
      
      setStageSubstages(prev => ({
        ...prev,
        [selectedStage]: prev[selectedStage].map((substage, index) =>
          index === substageIndex
            ? { ...substage, workOrders: [...substage.workOrders, newWorkOrder] }
            : substage
        )
      }))

      // Reset form
      setWorkOrderForm({
        type: "",
        title: "",
        priority: "medium",
        autoAssign: false
      })
      setShowWorkOrderForm(null)
    }
  }

  const resetWorkOrderForm = () => {
    setWorkOrderForm({
      type: "",
      title: "",
      priority: "medium",
      autoAssign: false
    })
    setShowWorkOrderForm(null)
  }

  const handleDeleteWorkOrder = (substageIndex: number, workOrderId: string) => {
    setStageSubstages(prev => ({
      ...prev,
      [selectedStage]: prev[selectedStage].map((substage, index) =>
        index === substageIndex
          ? { ...substage, workOrders: substage.workOrders.filter(wo => wo.id !== workOrderId) }
          : substage
      )
    }))
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-auto px-6 py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Tenant Lifecycle Settings</h1>
                <p className="text-gray-500">Configure the stages and substages in your tenant lifecycle</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </div>

            {/* Main Layout - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Lifecycle Stages */}
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Lifecycle Stages</CardTitle>
                    <p className="text-sm text-gray-600">Configure the stages in your tenant lifecycle</p>
                  </CardHeader>
                  <CardContent>
                    {/* Stages List */}
                    <div className="space-y-3 mb-6">
                      {lifecycleStages.map((stage, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedStage === stage.name 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedStage(stage.name)}
                        >
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: stage.color }}
                            />
                            <span className="font-medium text-gray-900 text-sm">{stage.name}</span>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                              {stage.duration}d
                            </Badge>
                            {stage.timeLimit && stage.timeLimit > 0 && (
                              <Badge variant="outline" className="text-xs">
                                Max {stage.timeLimit}d
                              </Badge>
                            )}
                          </div>
                          <Switch 
                            checked={stage.enabled}
                            onCheckedChange={() => handleStageToggle(stage.name)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Add Stage Button/Form */}
                    {!showAddStageForm ? (
                      <Button 
                        variant="outline" 
                        className="w-full border-dashed" 
                        size="sm"
                        onClick={() => setShowAddStageForm(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Stage
                      </Button>
                    ) : (
                      <div className="space-y-3 p-3 border border-dashed rounded-lg">
                        <Input
                          placeholder="Stage name"
                          value={newStageName}
                          onChange={(e) => setNewStageName(e.target.value)}
                        />
                        <Input
                          placeholder="Duration (days)"
                          type="number"
                          value={newStageDuration}
                          onChange={(e) => setNewStageDuration(e.target.value)}
                        />
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={handleAddStage} className="flex-1">
                            Add Stage
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              setShowAddStageForm(false)
                              setNewStageName("")
                              setNewStageDuration("")
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Stage Details */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedStage}</CardTitle>
                      <p className="text-sm text-gray-600">Configure this stage and its substages</p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteStage(selectedStage)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Stage
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {/* Stage Configuration Tabs */}
                    <Tabs defaultValue="substages" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="substages">Substages</TabsTrigger>
                        <TabsTrigger value="criteria">Criteria</TabsTrigger>
                        <TabsTrigger value="appearance">Appearance</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="substages" className="mt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Substages</h3>
                            {!showAddSubstageForm ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setShowAddSubstageForm(true)}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Substage
                              </Button>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Input
                                  placeholder="Substage name"
                                  value={newSubstageName}
                                  onChange={(e) => setNewSubstageName(e.target.value)}
                                  className="w-48"
                                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubstage()}
                                />
                                <Button size="sm" onClick={handleAddSubstage}>
                                  Add
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => {
                                    setShowAddSubstageForm(false)
                                    setNewSubstageName("")
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                          
                          {/* Substages List */}
                          <div className="space-y-3">
                            {currentSubstages.map((substage, index) => (
                              <div key={index} className="border rounded-lg bg-white">
                                {/* Substage Header */}
                                <div className="flex items-center space-x-3 p-3">
                                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                                  <span className="flex-1 text-sm font-medium">{substage.name}</span>
                                  {substage.workOrders.length > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                      {substage.workOrders.length} work order{substage.workOrders.length !== 1 ? 's' : ''}
                                    </Badge>
                                  )}
                                  <Switch 
                                    checked={substage.enabled}
                                    onCheckedChange={() => handleSubstageToggle(index)}
                                  />
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-gray-400 hover:text-red-600"
                                    onClick={() => handleDeleteSubstage(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* Work Orders Section */}
                                <div className="border-t bg-gray-50 p-3">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-medium text-gray-600">Work Orders</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setShowWorkOrderForm(showWorkOrderForm === index ? null : index)}
                                      className="text-xs h-6"
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add
                                    </Button>
                                  </div>

                                  {/* Work Orders List */}
                                  {substage.workOrders.length > 0 && (
                                    <div className="space-y-2 mb-3">
                                      {substage.workOrders.map((workOrder) => (
                                        <div key={workOrder.id} className="flex items-center justify-between p-2 bg-white rounded border text-xs">
                                          <div className="flex items-center space-x-2">
                                            <Badge 
                                              variant="outline" 
                                              className="text-xs"
                                            >
                                              {workOrderTypes.find(t => t.value === workOrder.type)?.label}
                                            </Badge>
                                            <span className="font-medium">{workOrder.title}</span>
                                            <Badge 
                                              variant={workOrder.priority === 'high' ? 'destructive' : 
                                                     workOrder.priority === 'medium' ? 'default' : 'secondary'}
                                              className="text-xs"
                                            >
                                              {workOrder.priority}
                                            </Badge>
                                            {workOrder.autoAssign && (
                                              <Badge variant="outline" className="text-xs">Auto-assign</Badge>
                                            )}
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteWorkOrder(index, workOrder.id)}
                                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Add Work Order Form */}
                                  {showWorkOrderForm === index && (
                                    <div className="space-y-3 p-3 border rounded bg-white">
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Type
                                          </label>
                                          <Select 
                                            value={workOrderForm.type} 
                                            onValueChange={(value) => setWorkOrderForm(prev => ({ ...prev, type: value }))}
                                          >
                                            <SelectTrigger className="h-8 text-xs">
                                              <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {workOrderTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value} className="text-xs">
                                                  {type.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Priority
                                          </label>
                                          <Select 
                                            value={workOrderForm.priority} 
                                            onValueChange={(value: 'low' | 'medium' | 'high') => setWorkOrderForm(prev => ({ ...prev, priority: value }))}
                                          >
                                            <SelectTrigger className="h-8 text-xs">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="low" className="text-xs">Low</SelectItem>
                                              <SelectItem value="medium" className="text-xs">Medium</SelectItem>
                                              <SelectItem value="high" className="text-xs">High</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                          Title
                                        </label>
                                        <Input
                                          placeholder="Work order title"
                                          value={workOrderForm.title}
                                          onChange={(e) => setWorkOrderForm(prev => ({ ...prev, title: e.target.value }))}
                                          className="h-8 text-xs"
                                        />
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          checked={workOrderForm.autoAssign}
                                          onCheckedChange={(checked) => setWorkOrderForm(prev => ({ ...prev, autoAssign: checked }))}
                                        />
                                        <label className="text-xs text-gray-600">Auto-assign when substage completes</label>
                                      </div>
                                      <div className="flex space-x-2">
                                        <Button 
                                          size="sm" 
                                          onClick={() => handleAddWorkOrder(index)}
                                          className="h-7 text-xs"
                                          disabled={!workOrderForm.type || !workOrderForm.title.trim()}
                                        >
                                          Add Work Order
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="ghost"
                                          onClick={resetWorkOrderForm}
                                          className="h-7 text-xs"
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="criteria" className="mt-6">
                        <div className="space-y-6">
                          {/* Time Limit Settings */}
                          <div className="p-4 border rounded-lg bg-gray-50">
                            <h3 className="text-lg font-medium mb-4">Time Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Target Duration (days)
                                </label>
                                <Input
                                  type="number"
                                  value={currentStage?.duration || 0}
                                  onChange={(e) => {
                                    const duration = parseInt(e.target.value) || 0
                                    setLifecycleStages(prev => 
                                      prev.map(stage => 
                                        stage.name === selectedStage 
                                          ? { ...stage, duration }
                                          : stage
                                      )
                                    )
                                  }}
                                  className="w-full"
                                  min="0"
                                />
                                <p className="text-xs text-gray-500 mt-1">Expected time to complete this stage</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Time Limit (days)
                                </label>
                                <Input
                                  type="number"
                                  value={currentStage?.timeLimit || 0}
                                  onChange={(e) => handleTimeLimitChange(parseInt(e.target.value) || 0)}
                                  className="w-full"
                                  min="0"
                                />
                                <p className="text-xs text-gray-500 mt-1">Maximum time allowed (0 = no limit)</p>
                              </div>
                            </div>
                          </div>

                          {/* Criteria Checklist */}
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="text-lg font-medium">Completion Criteria</h3>
                                <p className="text-sm text-gray-600">Define what must be completed before moving to the next stage</p>
                              </div>
                              {!showAddCriteriaForm ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setShowAddCriteriaForm(true)}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add Criteria
                                </Button>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <Input
                                    placeholder="Criteria name"
                                    value={newCriteriaName}
                                    onChange={(e) => setNewCriteriaName(e.target.value)}
                                    className="w-48"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddCriteria()}
                                  />
                                  <Button size="sm" onClick={handleAddCriteria}>
                                    Add
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => {
                                      setShowAddCriteriaForm(false)
                                      setNewCriteriaName("")
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              )}
                            </div>
                            
                            {/* Criteria List */}
                            <div className="space-y-3">
                              {currentStage?.criteria.map((criteria) => (
                                <div key={criteria.id} className="flex items-center space-x-3 p-3 border rounded-lg bg-white">
                                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-3">
                                      <span className="text-sm font-medium">{criteria.name}</span>
                                      <Badge 
                                        variant={criteria.required ? "default" : "secondary"}
                                        className="text-xs"
                                      >
                                        {criteria.required ? "Required" : "Optional"}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleCriteriaToggle(criteria.id)}
                                      className="text-xs"
                                    >
                                      {criteria.required ? "Make Optional" : "Make Required"}
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-gray-400 hover:text-red-600"
                                      onClick={() => handleDeleteCriteria(criteria.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                              
                              {(!currentStage?.criteria || currentStage.criteria.length === 0) && (
                                <div className="text-center py-8 text-gray-500">
                                  <div className="mb-2">No criteria defined</div>
                                  <div className="text-sm">Add criteria to define completion requirements</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="appearance" className="mt-6">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Stage Color</h3>
                            <p className="text-sm text-gray-600 mb-4">Choose a color to represent this stage in the kanban board</p>
                            
                            {/* Color Picker Grid */}
                            <div className="grid grid-cols-8 gap-3 mb-4">
                              {[
                                "#3B82F6", "#8B5CF6", "#F59E0B", "#10B981", 
                                "#06B6D4", "#22C55E", "#EF4444", "#6B7280",
                                "#EC4899", "#F97316", "#84CC16", "#14B8A6",
                                "#6366F1", "#8B5A2B", "#DC2626", "#059669"
                              ].map((color) => (
                                <button
                                  key={color}
                                  onClick={() => handleColorChange(color)}
                                  className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 ${
                                    currentStage?.color === color 
                                      ? 'border-gray-800 shadow-lg' 
                                      : 'border-gray-200 hover:border-gray-400'
                                  }`}
                                  style={{ backgroundColor: color }}
                                >
                                  {currentStage?.color === color && (
                                    <div className="flex items-center justify-center h-full">
                                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>

                            {/* Custom Color Input */}
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="color"
                                  value={currentStage?.color || "#6B7280"}
                                  onChange={(e) => handleColorChange(e.target.value)}
                                  className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                                />
                                <span className="text-sm text-gray-600">Custom color</span>
                              </div>
                              <div className="text-sm text-gray-500 font-mono">
                                {currentStage?.color || "#6B7280"}
                              </div>
                            </div>
                          </div>

                          {/* Preview */}
                          <div className="p-4 border rounded-lg bg-gray-50">
                            <h4 className="text-sm font-medium mb-3">Preview</h4>
                            <div className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: currentStage?.color || "#6B7280" }}
                              />
                              <span className="text-sm font-medium">{selectedStage}</span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
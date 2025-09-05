"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  FileText, 
  Cloud, 
  Upload, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  X,
  AlertTriangle,
  Users,
  Building2,
  Home,
  DollarSign,
  Settings,
  FileIcon,
  Plus,
  Trash2
} from "lucide-react"
import { useRouter } from "next/navigation"
import { 
  getTenants, 
  getBuildings, 
  getSpacesByBuilding, 
  addLease, 
  updateLease, 
  generateLeaseId 
} from "@/lib/leasesData"

interface AddLeaseModalProps {
  isOpen: boolean
  onClose: () => void
  onLeaseAdded: () => void
}

const LEASE_TYPES = [
  "Triple Net (NNN)",
  "Modified Gross (MG)", 
  "Full-Service Gross (FSG)",
  "Single Net (N)",
  "Double Net (NN)",
  "Absolute NNN"
]

const LEASE_STATUSES = [
  "active",
  "draft", 
  "pending",
  "expired",
  "terminated"
]

interface LeaseFormData {
  // General
  lease_id: string
  lease_structure: string
  commencement_date: string
  expiration_date: string
  lease_term_months: number | null
  lease_status: string
  property_type: string
  
  // Parties
  tenant_id: number | null
  building_id: string
  
  // Premises
  leased_spaces: Array<{
    space_id: string
    start_date: string
    end_date: string
  }>
  
  // Rent
  base_rent_annual: number | null
  security_deposit: number | null
  escalation_rate: number | null
  rent_roll: number | null
  
  // Operations
  landlord_obligations: string[]
  tenant_obligations: string[]
  sublease_policy: string
  
  // Documents
  lease_document_url: string
  amendment_history: string
}

const initialFormData: LeaseFormData = {
  lease_id: "",
  lease_structure: "",
  commencement_date: "",
  expiration_date: "",
  lease_term_months: null,
  lease_status: "draft",
  property_type: "Office",
  tenant_id: null,
  building_id: "",
  leased_spaces: [],
  base_rent_annual: null,
  security_deposit: null,
  escalation_rate: null,
  rent_roll: null,
  landlord_obligations: [],
  tenant_obligations: [],
  sublease_policy: "",
  lease_document_url: "",
  amendment_history: ""
}

export function AddLeaseModal({ isOpen, onClose, onLeaseAdded }: AddLeaseModalProps) {
  const router = useRouter()
  const [currentView, setCurrentView] = useState<'options' | 'wizard'>('options')
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<LeaseFormData>(initialFormData)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [showOptionalFieldsToast, setShowOptionalFieldsToast] = useState(false)
  const [draftLeaseId, setDraftLeaseId] = useState<string | null>(null)
  
  // Data from mock database
  const [tenants, setTenants] = useState<any[]>([])
  const [buildings, setBuildings] = useState<any[]>([])
  const [availableSpaces, setAvailableSpaces] = useState<any[]>([])

  useEffect(() => {
    setTenants(getTenants())
    setBuildings(getBuildings())
  }, [])

  // Update available spaces when building changes
  useEffect(() => {
    if (formData.building_id) {
      setAvailableSpaces(getSpacesByBuilding(formData.building_id))
    } else {
      setAvailableSpaces([])
    }
  }, [formData.building_id])

  // Calculate lease term when dates change
  useEffect(() => {
    if (formData.commencement_date && formData.expiration_date) {
      const start = new Date(formData.commencement_date)
      const end = new Date(formData.expiration_date)
      const diffTime = end.getTime() - start.getTime()
      const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44)) // Average days per month
      setFormData(prev => ({ ...prev, lease_term_months: diffMonths }))
    }
  }, [formData.commencement_date, formData.expiration_date])

  // Calculate monthly rent when annual rent changes
  useEffect(() => {
    if (formData.base_rent_annual) {
      setFormData(prev => ({ 
        ...prev, 
        rent_roll: Math.round(formData.base_rent_annual / 12) 
      }))
    }
  }, [formData.base_rent_annual])

  const resetForm = () => {
    setFormData({ ...initialFormData, lease_id: generateLeaseId() })
    setCurrentStep(1)
    setCurrentView('options')
    setErrors({})
    setDraftLeaseId(null)
    setShowOptionalFieldsToast(false)
  }

  const handleClose = () => {
    if (currentView === 'wizard' && hasFormData()) {
      if (confirm("You have unsaved changes. Are you sure you want to close without saving?")) {
        resetForm()
        onClose()
      }
    } else {
      resetForm()
      onClose()
    }
  }

  const hasFormData = () => {
    return formData.tenant_id || formData.building_id || formData.commencement_date || formData.base_rent_annual
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {}
    
    switch (step) {
      case 1: // General
        if (!formData.lease_structure) {
          newErrors.lease_structure = "Please select a lease structure"
        }
        if (!formData.commencement_date) {
          newErrors.commencement_date = "Please select a commencement date"
        }
        if (!formData.expiration_date) {
          newErrors.expiration_date = "Please select an expiration date"
        }
        if (formData.commencement_date && formData.expiration_date) {
          const start = new Date(formData.commencement_date)
          const end = new Date(formData.expiration_date)
          if (start >= end) {
            newErrors.expiration_date = "The expiration date must be after the commencement date. Please select a valid end date."
          }
        }
        break
        
      case 2: // Parties
        if (!formData.tenant_id) {
          newErrors.tenant_id = "Please select a tenant to associate with this lease."
        }
        break
        
      case 4: // Rent
        if (!formData.base_rent_annual || formData.base_rent_annual <= 0) {
          newErrors.base_rent_annual = "Base rent must be a positive number in USD."
        }
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getOptionalFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 1:
        return ['property_type']
      case 3:
        return ['leased_spaces']
      case 4:
        return ['security_deposit', 'escalation_rate']
      case 5:
        return ['landlord_obligations', 'tenant_obligations', 'sublease_policy']
      case 6:
        return ['lease_document_url', 'amendment_history']
      default:
        return []
    }
  }

  const checkOptionalFields = (step: number): boolean => {
    const optionalFields = getOptionalFieldsForStep(step)
    const emptyFields = optionalFields.filter(field => {
      const value = formData[field as keyof LeaseFormData]
      if (Array.isArray(value)) {
        return value.length === 0
      }
      return !value || value === ""
    })
    
    if (emptyFields.length > 0) {
      setShowOptionalFieldsToast(true)
      setTimeout(() => setShowOptionalFieldsToast(false), 5000)
      return true
    }
    return false
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      checkOptionalFields(currentStep)
      setCurrentStep(prev => Math.min(prev + 1, 6))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const saveDraft = async () => {
    const leaseData = {
      ...formData,
      lease_status: 'draft',
      space_info: formData.leased_spaces.length > 0 ? "Selected spaces" : "TBD"
    }

    if (draftLeaseId) {
      updateLease(draftLeaseId, leaseData)
    } else {
      const newLease = addLease(leaseData)
      setDraftLeaseId(newLease.lease_id)
    }
    
    onLeaseAdded()
  }

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      const leaseData = {
        ...formData,
        lease_status: 'active',
        space_info: formData.leased_spaces.length > 0 ? "Selected spaces" : "TBD"
      }

      const newLease = addLease(leaseData)
      onLeaseAdded()
      router.push(`/leases/${newLease.lease_id}`)
      resetForm()
      onClose()
    }
  }

  const renderOptions = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add a New Lease</h2>
        <p className="text-gray-600">Choose how you'd like to create your lease</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-blue-500 bg-gradient-to-br from-white to-blue-50/30"
          onClick={() => {
            setFormData(prev => ({ ...prev, lease_id: generateLeaseId() }))
            setCurrentView('wizard')
          }}
        >
          <CardHeader className="text-center py-8">
            <div className="flex justify-center items-center mb-6">
              <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900 mb-2">Manual Entry</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <p className="text-gray-600 leading-relaxed">
              Create a lease by entering details step-by-step with our guided wizard
            </p>
          </CardContent>
        </Card>

        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-md border-2 hover:border-gray-300 bg-gradient-to-br from-white to-gray-50/50 opacity-75">
          <CardHeader className="text-center py-8">
            <div className="flex justify-center items-center mb-6">
              <div className="p-4 bg-gray-100 rounded-full">
                <Cloud className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <CardTitle className="text-xl font-semibold text-gray-500 mb-2">Connect Other Source</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <p className="text-gray-500 leading-relaxed mb-4">
              Import from property management software or other systems
            </p>
            <Badge variant="outline" className="text-xs text-gray-400 border-gray-300">
              Coming Soon!
            </Badge>
          </CardContent>
        </Card>

        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-md border-2 hover:border-gray-300 bg-gradient-to-br from-white to-gray-50/50 opacity-75">
          <CardHeader className="text-center py-8">
            <div className="flex justify-center items-center mb-6">
              <div className="p-4 bg-gray-100 rounded-full">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <CardTitle className="text-xl font-semibold text-gray-500 mb-2">Upload Document</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <p className="text-gray-500 leading-relaxed mb-4">
              Upload an existing lease document and extract key information automatically
            </p>
            <Badge variant="outline" className="text-xs text-gray-400 border-gray-300">
              Coming Soon!
            </Badge>
          </CardContent>
        </Card>

        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-md border-2 hover:border-gray-300 bg-gradient-to-br from-white to-gray-50/50 opacity-75">
          <CardHeader className="text-center py-8">
            <div className="flex justify-center items-center mb-6">
              <div className="p-4 bg-gray-100 rounded-full">
                <Sparkles className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <CardTitle className="text-xl font-semibold text-gray-500 mb-2">Ask HqO to Do It</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <p className="text-gray-500 leading-relaxed mb-4">
              Let our team handle the lease creation process for you
            </p>
            <Badge variant="outline" className="text-xs text-gray-400 border-gray-300">
              Coming Soon!
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderGeneralStep()
      case 2:
        return renderPartiesStep()
      case 3:
        return renderPremisesStep()
      case 4:
        return renderRentStep()
      case 5:
        return renderOperationsStep()
      case 6:
        return renderDocumentsStep()
      default:
        return null
    }
  }

  const renderGeneralStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">General Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="lease_id">Lease ID</Label>
          <Input
            id="lease_id"
            value={formData.lease_id}
            disabled
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">Auto-generated</p>
        </div>

        <div>
          <Label htmlFor="lease_structure">Lease Structure *</Label>
          <Select 
            value={formData.lease_structure} 
            onValueChange={(value) => handleInputChange('lease_structure', value)}
          >
            <SelectTrigger className={errors.lease_structure ? "border-red-500" : ""}>
              <SelectValue placeholder="Select lease structure" />
            </SelectTrigger>
            <SelectContent>
              {LEASE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.lease_structure && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              {errors.lease_structure}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="commencement_date">Commencement Date *</Label>
          <Input
            id="commencement_date"
            type="date"
            value={formData.commencement_date}
            onChange={(e) => handleInputChange('commencement_date', e.target.value)}
            className={errors.commencement_date ? "border-red-500" : ""}
          />
          {errors.commencement_date && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              {errors.commencement_date}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="expiration_date">Expiration Date *</Label>
          <Input
            id="expiration_date"
            type="date"
            value={formData.expiration_date}
            onChange={(e) => handleInputChange('expiration_date', e.target.value)}
            className={errors.expiration_date ? "border-red-500" : ""}
          />
          {errors.expiration_date && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              {errors.expiration_date}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="lease_term_months">Lease Term (Months)</Label>
          <Input
            id="lease_term_months"
            type="number"
            value={formData.lease_term_months || ''}
            disabled
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">Calculated from dates</p>
        </div>

        <div>
          <Label htmlFor="property_type" className="flex items-center gap-2">
            Property Type
            <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">Optional</Badge>
          </Label>
          <Input
            id="property_type"
            value={formData.property_type}
            onChange={(e) => handleInputChange('property_type', e.target.value)}
            placeholder="e.g., Office, Retail, Industrial"
            className={!formData.property_type ? "border-yellow-300 bg-yellow-50" : ""}
          />
        </div>

        <div>
          <Label htmlFor="lease_status">Lease Status</Label>
          <Select 
            value={formData.lease_status} 
            onValueChange={(value) => handleInputChange('lease_status', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEASE_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderPartiesStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Parties</h3>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="tenant_id">Tenant *</Label>
          <Select 
            value={formData.tenant_id?.toString() || ''} 
            onValueChange={(value) => handleInputChange('tenant_id', parseInt(value))}
          >
            <SelectTrigger className={errors.tenant_id ? "border-red-500" : ""}>
              <SelectValue placeholder="Select a tenant" />
            </SelectTrigger>
            <SelectContent>
              {tenants.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.id.toString()}>
                  <div className="flex items-center gap-2">
                    <span>{tenant.name}</span>
                    <Badge variant="outline" className="text-xs">{tenant.industry}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tenant_id && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              {errors.tenant_id}
            </p>
          )}
        </div>

        {formData.tenant_id && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">Selected Tenant</h4>
                <p className="text-blue-700">
                  {tenants.find(t => t.id === formData.tenant_id)?.name}
                </p>
                <p className="text-sm text-blue-600">
                  {tenants.find(t => t.id === formData.tenant_id)?.industry}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={`/tenants/${formData.tenant_id}`} target="_blank">
                  View Details
                </a>
              </Button>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="building_id">Building</Label>
          <Select 
            value={formData.building_id} 
            onValueChange={(value) => handleInputChange('building_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a building" />
            </SelectTrigger>
            <SelectContent>
              {buildings.map((building) => (
                <SelectItem key={building.id} value={building.id}>
                  <div>
                    <div className="font-medium">{building.name}</div>
                    <div className="text-sm text-gray-500">{building.address}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderPremisesStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Home className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Premises</h3>
      </div>

      <div className="space-y-6">
        {formData.building_id ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="flex items-center gap-2">
                Leased Spaces
                <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">Optional</Badge>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    leased_spaces: [...prev.leased_spaces, { space_id: '', start_date: formData.commencement_date, end_date: formData.expiration_date }]
                  }))
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Space
              </Button>
            </div>

            {formData.leased_spaces.map((space, index) => (
              <Card key={index} className={`mb-4 ${formData.leased_spaces.length === 0 ? 'border-yellow-300 bg-yellow-50' : ''}`}>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Space</Label>
                      <Select
                        value={space.space_id}
                        onValueChange={(value) => {
                          const newSpaces = [...formData.leased_spaces]
                          newSpaces[index].space_id = value
                          setFormData(prev => ({ ...prev, leased_spaces: newSpaces }))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select space" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSpaces.map((space) => (
                            <SelectItem key={space.id} value={space.id}>
                              <div>
                                <div className="font-medium">{space.unitNumber}</div>
                                <div className="text-sm text-gray-500">
                                  Floor {space.floor} • {space.area.toLocaleString()} sq ft • {space.spaceType}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={space.start_date}
                        onChange={(e) => {
                          const newSpaces = [...formData.leased_spaces]
                          newSpaces[index].start_date = e.target.value
                          setFormData(prev => ({ ...prev, leased_spaces: newSpaces }))
                        }}
                      />
                    </div>

                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={space.end_date}
                          onChange={(e) => {
                            const newSpaces = [...formData.leased_spaces]
                            newSpaces[index].end_date = e.target.value
                            setFormData(prev => ({ ...prev, leased_spaces: newSpaces }))
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newSpaces = formData.leased_spaces.filter((_, i) => i !== index)
                          setFormData(prev => ({ ...prev, leased_spaces: newSpaces }))
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-1">Not seeing the space you're looking for?</p>
              <p>Select additional buildings in the Parties step or contact your building manager to add new spaces.</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Please select a building in the Parties step to view available spaces.</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderRentStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Rent & Financial Terms</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="base_rent_annual">Annual Base Rent (USD) *</Label>
          <Input
            id="base_rent_annual"
            type="number"
            value={formData.base_rent_annual || ''}
            onChange={(e) => handleInputChange('base_rent_annual', parseFloat(e.target.value) || null)}
            placeholder="750000"
            className={errors.base_rent_annual ? "border-red-500" : ""}
          />
          {errors.base_rent_annual && (
            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              {errors.base_rent_annual}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="rent_roll">Monthly Rent (USD)</Label>
          <Input
            id="rent_roll"
            type="number"
            value={formData.rent_roll || ''}
            disabled
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">Calculated from annual rent</p>
        </div>

        <div>
          <Label htmlFor="security_deposit" className="flex items-center gap-2">
            Security Deposit (USD)
            <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">Optional</Badge>
          </Label>
          <Input
            id="security_deposit"
            type="number"
            value={formData.security_deposit || ''}
            onChange={(e) => handleInputChange('security_deposit', parseFloat(e.target.value) || null)}
            placeholder="125000"
            className={!formData.security_deposit ? "border-yellow-300 bg-yellow-50" : ""}
          />
        </div>

        <div>
          <Label htmlFor="escalation_rate" className="flex items-center gap-2">
            Annual Escalation Rate (%)
            <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">Optional</Badge>
          </Label>
          <Input
            id="escalation_rate"
            type="number"
            step="0.1"
            value={formData.escalation_rate || ''}
            onChange={(e) => handleInputChange('escalation_rate', parseFloat(e.target.value) || null)}
            placeholder="3.0"
            className={!formData.escalation_rate ? "border-yellow-300 bg-yellow-50" : ""}
          />
        </div>
      </div>

      {formData.base_rent_annual && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Rent Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-600">Annual Rent:</span>
              <div className="font-medium text-blue-900">
                ${formData.base_rent_annual.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-blue-600">Monthly Rent:</span>
              <div className="font-medium text-blue-900">
                ${formData.rent_roll?.toLocaleString()}
              </div>
            </div>
            {formData.escalation_rate && (
              <div>
                <span className="text-blue-600">Annual Escalation:</span>
                <div className="font-medium text-blue-900">
                  {formData.escalation_rate}%
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  const renderOperationsStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Operations & Responsibilities</h3>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="flex items-center gap-2 mb-3">
            Landlord Obligations
            <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">Optional</Badge>
          </Label>
          <Textarea
            value={formData.landlord_obligations.join('\n')}
            onChange={(e) => handleInputChange('landlord_obligations', e.target.value.split('\n').filter(item => item.trim()))}
            placeholder="Enter each obligation on a new line:&#10;Structural maintenance and repairs&#10;Common area maintenance&#10;Property insurance"
            rows={4}
            className={formData.landlord_obligations.length === 0 ? "border-yellow-300 bg-yellow-50" : ""}
          />
          <p className="text-xs text-gray-500 mt-1">Enter each obligation on a separate line</p>
        </div>

        <div>
          <Label className="flex items-center gap-2 mb-3">
            Tenant Obligations
            <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">Optional</Badge>
          </Label>
          <Textarea
            value={formData.tenant_obligations.join('\n')}
            onChange={(e) => handleInputChange('tenant_obligations', e.target.value.split('\n').filter(item => item.trim()))}
            placeholder="Enter each obligation on a new line:&#10;Interior maintenance and repairs&#10;Utilities payments&#10;General liability insurance"
            rows={4}
            className={formData.tenant_obligations.length === 0 ? "border-yellow-300 bg-yellow-50" : ""}
          />
          <p className="text-xs text-gray-500 mt-1">Enter each obligation on a separate line</p>
        </div>

        <div>
          <Label htmlFor="sublease_policy" className="flex items-center gap-2">
            Sublease Policy
            <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">Optional</Badge>
          </Label>
          <Textarea
            id="sublease_policy"
            value={formData.sublease_policy}
            onChange={(e) => handleInputChange('sublease_policy', e.target.value)}
            placeholder="e.g., Permitted with landlord's written consent"
            rows={2}
            className={!formData.sublease_policy ? "border-yellow-300 bg-yellow-50" : ""}
          />
        </div>
      </div>
    </div>
  )

  const renderDocumentsStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileIcon className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Documents</h3>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="lease_document_url" className="flex items-center gap-2">
            Lease Document URL
            <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">Optional</Badge>
          </Label>
          <Input
            id="lease_document_url"
            type="url"
            value={formData.lease_document_url}
            onChange={(e) => handleInputChange('lease_document_url', e.target.value)}
            placeholder="https://docs.example.com/lease-document.pdf"
            className={!formData.lease_document_url ? "border-yellow-300 bg-yellow-50" : ""}
          />
          <p className="text-xs text-gray-500 mt-1">Link to the signed lease document</p>
        </div>

        <div>
          <Label htmlFor="amendment_history" className="flex items-center gap-2">
            Amendment History & Notes
            <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">Optional</Badge>
          </Label>
          <Textarea
            id="amendment_history"
            value={formData.amendment_history}
            onChange={(e) => handleInputChange('amendment_history', e.target.value)}
            placeholder="Enter any amendments, modifications, or additional notes about this lease..."
            rows={4}
            className={!formData.amendment_history ? "border-yellow-300 bg-yellow-50" : ""}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Document Upload</h4>
          <p className="text-sm text-gray-600 mb-3">
            Upload lease documents, amendments, and related files directly to your lease record.
          </p>
          <Button variant="outline" disabled>
            <Upload className="h-4 w-4 mr-2" />
            Upload Documents
            <Badge variant="outline" className="ml-2 text-xs">Coming Soon</Badge>
          </Button>
        </div>
      </div>
    </div>
  )

  const renderWizard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Create New Lease</h2>
          <p className="text-gray-600">Step {currentStep} of 6</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={saveDraft} size="sm">
            Save Draft
          </Button>
          <Button variant="ghost" onClick={() => setCurrentView('options')} size="sm">
            <ChevronLeft className="h-4 w-4" />
            Back to Options
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={(currentStep / 6) * 100} className="h-2" />
        <div className="grid grid-cols-6 gap-2 text-xs text-gray-500">
          <span className={currentStep >= 1 ? "text-blue-600 font-medium" : ""}>General</span>
          <span className={currentStep >= 2 ? "text-blue-600 font-medium" : ""}>Parties</span>
          <span className={currentStep >= 3 ? "text-blue-600 font-medium" : ""}>Premises</span>
          <span className={currentStep >= 4 ? "text-blue-600 font-medium" : ""}>Rent</span>
          <span className={currentStep >= 5 ? "text-blue-600 font-medium" : ""}>Operations</span>
          <span className={currentStep >= 6 ? "text-blue-600 font-medium" : ""}>Documents</span>
        </div>
      </div>

      {/* Optional Fields Toast */}
      {showOptionalFieldsToast && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-800">
                You have left some optional fields empty. Want to add more detail or move on?
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowOptionalFieldsToast(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          
          {currentStep < 6 ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Create Lease
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Add New Lease</DialogTitle>
        </DialogHeader>
        
        {currentView === 'options' ? renderOptions() : renderWizard()}
      </DialogContent>
    </Dialog>
  )
} 
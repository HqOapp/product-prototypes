"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { 
  Building2, 
  Search, 
  MapPin, 
  Square, 
  Users, 
  Calendar as CalendarIcon,
  Clock,
  Link as LinkIcon,
  FileText,
  Upload,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  X,
  Mail,
  Phone,
  Briefcase,
  User,
  Plus,
  Check
} from "lucide-react"

interface AddTourModalProps {
  isOpen: boolean
  onClose: () => void
  onTourCreated: (tourData: any) => void
}

interface Building {
  id: string
  name: string
  address: string
  submarket: string
}

interface Suite {
  id: string
  suite: string
  floor: number
  rsf: number
  status: 'available' | 'occupied' | 'coming-soon'
}

interface TourFormData {
  // Step 1: Building & Suites
  selectedBuildings: Building[]
  selectedSuites: Suite[]
  
  // Step 2: Broker & Prospect
  brokerName: string
  brokerCompany: string
  brokerEmail: string
  prospectName: string
  prospectCompany: string
  prospectEmail: string
  whyNow: string
  
  // Step 3: Scheduling
  schedulingType: 'manual' | 'link'
  selectedDate: Date | null
  selectedTime: string
  timeSlots: string[]
  
  // Step 5: Notes & Access
  internalNotes: string
  sendVisitorAccess: boolean
  sendWelcomeEmail: boolean
  uploadedDocs: File[]
  
  // Step 6: Review
  confirmed: boolean
}

const mockBuildings: Building[] = [
  { id: "cobblestone", name: "Cobblestone Collaborative", address: "123 Innovation Drive, San Francisco, CA", submarket: "SOMA" },
  { id: "metro-tower", name: "Metro Tower", address: "456 Business Blvd, San Francisco, CA", submarket: "Financial District" },
  { id: "innovation-hub", name: "Innovation Hub", address: "789 Tech Street, San Francisco, CA", submarket: "Mission Bay" },
]

const mockSuites: { [buildingId: string]: Suite[] } = {
  "cobblestone": [
    { id: "801", suite: "Suite 801", floor: 8, rsf: 12500, status: "available" },
    { id: "802", suite: "Suite 802", floor: 8, rsf: 8750, status: "available" },
    { id: "1201", suite: "Suite 1201", floor: 12, rsf: 15000, status: "coming-soon" },
    { id: "1202", suite: "Suite 1202", floor: 12, rsf: 10500, status: "occupied" },
  ],
  "metro-tower": [
    { id: "1501", suite: "Suite 1501", floor: 15, rsf: 20000, status: "available" },
    { id: "1502", suite: "Suite 1502", floor: 15, rsf: 18500, status: "available" },
    { id: "1601", suite: "Suite 1601", floor: 16, rsf: 25000, status: "coming-soon" },
  ],
  "innovation-hub": [
    { id: "301", suite: "Studio A", floor: 3, rsf: 5500, status: "available" },
    { id: "302", suite: "Studio B", floor: 3, rsf: 6000, status: "available" },
    { id: "401", suite: "Suite 401", floor: 4, rsf: 12000, status: "occupied" },
  ],
}

const suggestedTimeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

// Mock broker data for typeahead
const mockBrokers = [
  {
    id: "1",
    email: "john.smith@cbre.com",
    name: "John Smith",
    company: "CBRE"
  },
  {
    id: "2", 
    email: "sarah.johnson@cushwake.com",
    name: "Sarah Johnson",
    company: "Cushman & Wakefield"
  },
  {
    id: "3",
    email: "mike.chen@jll.com", 
    name: "Mike Chen",
    company: "JLL"
  },
  {
    id: "4",
    email: "lisa.rodriguez@colliers.com",
    name: "Lisa Rodriguez", 
    company: "Colliers International"
  },
  {
    id: "5",
    email: "david.wilson@newmark.com",
    name: "David Wilson",
    company: "Newmark"
  },
  {
    id: "6",
    email: "emily.davis@kidder.com",
    name: "Emily Davis",
    company: "Kidder Mathews"
  }
]

// Mock company and contact data for prospect typeahead
const mockCompanies = [
  {
    id: "1",
    name: "TechFlow Solutions",
    industry: "Technology",
    contacts: [
      { id: "1", name: "Sarah Martinez", email: "sarah.martinez@techflow.com", title: "CEO" },
      { id: "2", name: "David Kim", email: "david.kim@techflow.com", title: "COO" },
      { id: "3", name: "Lisa Chen", email: "lisa.chen@techflow.com", title: "Head of Real Estate" }
    ]
  },
  {
    id: "2",
    name: "Apex Financial Group",
    industry: "Financial Services",
    contacts: [
      { id: "4", name: "Michael Johnson", email: "mjohnson@apexfin.com", title: "Managing Director" },
      { id: "5", name: "Amanda Rodriguez", email: "arodriguez@apexfin.com", title: "VP Operations" }
    ]
  },
  {
    id: "3", 
    name: "GreenLeaf Consulting",
    industry: "Consulting",
    contacts: [
      { id: "6", name: "Robert Wilson", email: "rwilson@greenleaf.com", title: "Partner" },
      { id: "7", name: "Jennifer Taylor", email: "jtaylor@greenleaf.com", title: "Senior Manager" }
    ]
  },
  {
    id: "4",
    name: "Stellar Biotech",
    industry: "Biotechnology", 
    contacts: [
      { id: "8", name: "Dr. Emily Zhang", email: "ezhang@stellarbio.com", title: "Chief Scientific Officer" },
      { id: "9", name: "Mark Thompson", email: "mthompson@stellarbio.com", title: "Head of Facilities" }
    ]
  },
  {
    id: "5",
    name: "Urban Design Studio", 
    industry: "Architecture",
    contacts: [
      { id: "10", name: "Alex Rivera", email: "arivera@urbandesign.com", title: "Principal Architect" },
      { id: "11", name: "Sophie Brown", email: "sbrown@urbandesign.com", title: "Project Manager" }
    ]
  },
  {
    id: "6",
    name: "Digital Marketing Pro",
    industry: "Marketing",
    contacts: [
      { id: "12", name: "Chris Anderson", email: "canderson@digitalmarketingpro.com", title: "Creative Director" },
      { id: "13", name: "Rachel Green", email: "rgreen@digitalmarketingpro.com", title: "Account Director" }
    ]
  }
]

export function AddTourModal({ isOpen, onClose, onTourCreated }: AddTourModalProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [brokerSearchOpen, setBrokerSearchOpen] = useState(false)
  const [brokerSearchValue, setBrokerSearchValue] = useState("")
  const [companySearchOpen, setCompanySearchOpen] = useState(false)
  const [companySearchValue, setCompanySearchValue] = useState("")
  const [contactSearchOpen, setContactSearchOpen] = useState(false)
  const [contactSearchValue, setContactSearchValue] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [formData, setFormData] = useState<TourFormData>({
    selectedBuildings: [],
    selectedSuites: [],
    brokerName: "",
    brokerCompany: "",
    brokerEmail: "",
    prospectName: "",
    prospectCompany: "",
    prospectEmail: "",
    whyNow: "",
    schedulingType: "manual",
    selectedDate: null,
    selectedTime: "",
    timeSlots: suggestedTimeSlots,
    internalNotes: "",
    sendVisitorAccess: false,
    sendWelcomeEmail: false,
    uploadedDocs: [],
    confirmed: false
  })

  const steps = [
    { number: 1, title: "Buildings & Suites", icon: Building2 },
    { number: 2, title: "Broker Info", icon: Briefcase },
    { number: 3, title: "Prospect Info", icon: User },
    { number: 4, title: "Scheduling", icon: CalendarIcon },
    { number: 5, title: "Notes & Access", icon: FileText },
    { number: 6, title: "Review", icon: CheckCircle },
  ]



  const availableSuites = formData.selectedBuildings.length > 0
    ? formData.selectedBuildings.flatMap(building => 
        mockSuites[building.id] || []
      )
    : []

  const handleBuildingToggle = (building: Building) => {
    setFormData(prev => ({
      ...prev,
      selectedBuildings: prev.selectedBuildings.find(b => b.id === building.id)
        ? prev.selectedBuildings.filter(b => b.id !== building.id)
        : [...prev.selectedBuildings, building],
      selectedSuites: [] // Reset suites when buildings change
    }))
  }

  const handleSuiteToggle = (suite: Suite) => {
    setFormData(prev => ({
      ...prev,
      selectedSuites: prev.selectedSuites.find(s => s.id === suite.id)
        ? prev.selectedSuites.filter(s => s.id !== suite.id)
        : [...prev.selectedSuites, suite]
    }))
  }

  const handleBrokerSelect = (broker: any) => {
    setFormData(prev => ({
      ...prev,
      brokerEmail: broker.email,
      brokerName: broker.name,
      brokerCompany: broker.company
    }))
    setBrokerSearchValue(broker.email)
    setBrokerSearchOpen(false)
  }

  const handleNewBroker = () => {
    // Clear existing broker data when creating new
    setFormData(prev => ({
      ...prev,
      brokerName: "",
      brokerCompany: "",
      brokerEmail: brokerSearchValue
    }))
    setBrokerSearchOpen(false)
  }

  const filteredBrokers = mockBrokers.filter(broker =>
    broker.email.toLowerCase().includes(brokerSearchValue.toLowerCase()) ||
    broker.name.toLowerCase().includes(brokerSearchValue.toLowerCase()) ||
    broker.company.toLowerCase().includes(brokerSearchValue.toLowerCase())
  )

  const handleCompanySelect = (company: any) => {
    setSelectedCompany(company)
    setFormData(prev => ({
      ...prev,
      prospectCompany: company.name,
      prospectName: "", // Reset contact when company changes
      prospectEmail: ""
    }))
    setCompanySearchValue(company.name)
    setCompanySearchOpen(false)
    setContactSearchValue("") // Reset contact search
  }

  const handleNewCompany = () => {
    setSelectedCompany(null)
    setFormData(prev => ({
      ...prev,
      prospectCompany: companySearchValue,
      prospectName: "",
      prospectEmail: ""
    }))
    setCompanySearchOpen(false)
    setContactSearchValue("")
  }

  const handleContactSelect = (contact: any) => {
    setFormData(prev => ({
      ...prev,
      prospectName: contact.name,
      prospectEmail: contact.email
    }))
    setContactSearchValue(contact.name)
    setContactSearchOpen(false)
  }

  const handleNewContact = () => {
    setFormData(prev => ({
      ...prev,
      prospectName: contactSearchValue,
      prospectEmail: ""
    }))
    setContactSearchOpen(false)
  }

  const filteredCompanies = mockCompanies.filter(company =>
    company.name.toLowerCase().includes(companySearchValue.toLowerCase()) ||
    company.industry.toLowerCase().includes(companySearchValue.toLowerCase())
  )

  const availableContacts = selectedCompany ? selectedCompany.contacts : []
  const filteredContacts = availableContacts.filter((contact: any) =>
    contact.name.toLowerCase().includes(contactSearchValue.toLowerCase()) ||
    contact.email.toLowerCase().includes(contactSearchValue.toLowerCase()) ||
    contact.title.toLowerCase().includes(contactSearchValue.toLowerCase())
  )

  const getSuiteStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800 text-xs">Available</Badge>
      case "coming-soon":
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Coming Soon</Badge>
      case "occupied":
        return <Badge className="bg-gray-100 text-gray-600 text-xs">Occupied</Badge>
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Create tour data object
    const tourData = {
      id: `tour-${Date.now()}`,
      building: formData.selectedBuilding,
      suites: formData.selectedSuites,
      broker: {
        name: formData.brokerName,
        company: formData.brokerCompany,
        email: formData.brokerEmail
      },
      prospect: {
        name: formData.prospectName,
        company: formData.prospectCompany,
        email: formData.prospectEmail,
        whyNow: formData.whyNow
      },
      scheduling: {
        type: formData.schedulingType,
        date: formData.selectedDate,
        time: formData.selectedTime
      },
      notes: formData.internalNotes,
      accessEmail: formData.sendVisitorAccess,
      documents: formData.uploadedDocs,
      createdAt: new Date().toISOString()
    }

    onTourCreated(tourData)
    
    // Show success toast
    console.log("Triggering toast notification...")
    toast({
      variant: "success",
      title: "Tour Scheduled Successfully! 🎉",
      description: `Tour scheduled for ${formData.prospectName} at ${formData.selectedBuildings.map(b => b.name).join(", ")} on ${formData.selectedDate ? formData.selectedDate.toLocaleDateString() : "selected date"}.`,
    })
    console.log("Toast triggered")
    
    onClose()
    
    // Reset form
    setCurrentStep(1)
    setBrokerSearchOpen(false)
    setBrokerSearchValue("")
    setCompanySearchOpen(false)
    setCompanySearchValue("")
    setContactSearchOpen(false)
    setContactSearchValue("")
    setSelectedCompany(null)
    setFormData({
      selectedBuildings: [],
      selectedSuites: [],
      brokerName: "",
      brokerCompany: "",
      brokerEmail: "",
      prospectName: "",
      prospectCompany: "",
      prospectEmail: "",
      whyNow: "",
      schedulingType: "manual",
      selectedDate: null,
      selectedTime: "",
      timeSlots: suggestedTimeSlots,
      internalNotes: "",
      sendVisitorAccess: false,
      sendWelcomeEmail: false,
      uploadedDocs: [],
      confirmed: false
    })
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.selectedBuildings.length > 0 && formData.selectedSuites.length > 0
      case 2:
        return formData.brokerName && formData.brokerEmail
      case 3:
        return formData.prospectName && formData.prospectEmail
      case 4:
        return formData.schedulingType === "link" || (formData.selectedDate && formData.selectedTime)
      case 5:
        return true // Notes and access are optional
      case 6:
        return formData.confirmed
      default:
        return false
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Select Building & Suite(s)</h3>
              <p className="text-gray-600">Choose a building from your portfolio and select available suites to tour.</p>
            </div>
              
            {/* Building Picker */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-900">
                  Select Buildings <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-600">
                  Choose one or more buildings to include in this tour. You can select multiple buildings from your portfolio.
                </p>
                <div className="grid gap-3 max-h-80 overflow-y-auto rounded-lg border border-gray-200 p-2">
                  {mockBuildings.map((building) => (
                    <div
                      key={building.id}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.selectedBuildings.find(b => b.id === building.id)
                          ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleBuildingToggle(building)}
                    >
                      <div className="flex items-center space-x-4">
                        <Checkbox 
                          checked={!!formData.selectedBuildings.find(b => b.id === building.id)}
                          onChange={() => {}} // Handled by parent onClick
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-base">{building.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{building.address}</p>
                          <Badge variant="outline" className="mt-2 text-xs font-medium">
                            {building.submarket}
                          </Badge>
                        </div>
                      </div>
                      <Building2 className={`h-8 w-8 ${
                        formData.selectedBuildings.find(b => b.id === building.id) ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                    </div>
                  ))}
                </div>
                {formData.selectedBuildings.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900 mb-2">
                      {formData.selectedBuildings.length} building{formData.selectedBuildings.length !== 1 ? 's' : ''} selected
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedBuildings.map((building) => (
                        <Badge key={building.id} variant="outline" className="border-blue-300 text-blue-700">
                          {building.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Suite Selector */}
            {formData.selectedBuildings.length > 0 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Available Suites in Selected Buildings
                  </Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Select one or more suites to include in the tour. You can select multiple suites across different buildings and floors.
                  </p>
                </div>
                <div className="grid gap-3 max-h-72 overflow-y-auto rounded-lg border border-gray-200 p-2">
                  {availableSuites.map((suite) => (
                    <div
                      key={suite.id}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.selectedSuites.find(s => s.id === suite.id)
                          ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleSuiteToggle(suite)}
                    >
                      <div className="flex items-center space-x-4">
                        <Checkbox 
                          checked={!!formData.selectedSuites.find(s => s.id === suite.id)}
                          onChange={() => {}} // Handled by parent onClick
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <div>
                          <div className="font-semibold text-gray-900 text-base">{suite.suite}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Floor {suite.floor} • {formatNumber(suite.rsf)} RSF
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getSuiteStatusBadge(suite.status)}
                        <Square className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
                {formData.selectedSuites.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900">
                      {formData.selectedSuites.length} suite{formData.selectedSuites.length !== 1 ? 's' : ''} selected
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Total RSF: {formatNumber(formData.selectedSuites.reduce((sum, s) => sum + s.rsf, 0))}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Broker Information</h3>
              <p className="text-gray-600">Add broker details to manage the tour relationship and calendar coordination.</p>
            </div>
            
            {/* Broker Info */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center text-gray-900">
                  <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                  Broker Details
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Search for existing brokers or create a new one</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Search First */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">
                    Broker Email <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={brokerSearchOpen} onOpenChange={setBrokerSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={brokerSearchOpen}
                        className="w-full justify-start h-11 text-base font-normal"
                      >
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {formData.brokerEmail || "Search brokers by email or name..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" side="bottom" align="start">
                      <Command>
                        <CommandInput 
                          placeholder="Search brokers..." 
                          value={brokerSearchValue}
                          onValueChange={setBrokerSearchValue}
                        />
                        <CommandList>
                          <CommandEmpty>
                            <div className="p-4 text-center">
                              <p className="text-sm text-gray-600 mb-3">No brokers found</p>
                              <Button 
                                size="sm" 
                                onClick={handleNewBroker}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Create new broker
                              </Button>
                            </div>
                          </CommandEmpty>
                          <CommandGroup>
                            {filteredBrokers.map((broker) => (
                              <CommandItem
                                key={broker.id}
                                value={broker.email}
                                onSelect={() => handleBrokerSelect(broker)}
                                className="flex items-center justify-between p-3 cursor-pointer"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{broker.name}</p>
                                    <p className="text-xs text-gray-500">{broker.email}</p>
                                    <p className="text-xs text-gray-400">{broker.company}</p>
                                  </div>
                                </div>
                                {formData.brokerEmail === broker.email && (
                                  <Check className="h-4 w-4 text-blue-600" />
                                )}
                              </CommandItem>
                            ))}
                            {brokerSearchValue && filteredBrokers.length > 0 && (
                              <CommandItem
                                onSelect={handleNewBroker}
                                className="border-t border-gray-100 p-3 cursor-pointer"
                              >
                                <div className="flex items-center space-x-3 w-full">
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <Plus className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">Create new broker</p>
                                    <p className="text-xs text-gray-500">Add "{brokerSearchValue}" as new broker</p>
                                  </div>
                                </div>
                              </CommandItem>
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Pre-filled or manual broker details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="broker-name" className="text-sm font-medium text-gray-900">
                      Broker Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="broker-name"
                      value={formData.brokerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, brokerName: e.target.value }))}
                      placeholder="John Smith"
                      className="h-11 text-base"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="broker-company" className="text-sm font-medium text-gray-900">
                      Brokerage Company
                    </Label>
                    <Input
                      id="broker-company"
                      value={formData.brokerCompany}
                      onChange={(e) => setFormData(prev => ({ ...prev, brokerCompany: e.target.value }))}
                      placeholder="Commercial Realty Inc."
                      className="h-11 text-base"
                    />
                  </div>
                </div>

                {formData.brokerEmail && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Selected Broker</p>
                        <p className="text-sm text-blue-700">{formData.brokerName || "New broker"} • {formData.brokerEmail}</p>
                        {formData.brokerCompany && (
                          <p className="text-sm text-blue-600">{formData.brokerCompany}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Prospect Information</h3>
              <p className="text-gray-600">Contact details and context for the prospective tenant.</p>
            </div>
            
            {/* Prospect Info */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center text-gray-900">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  Tenant Prospect Information
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Search for existing companies and contacts or create new ones</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Company Search First */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={companySearchOpen} onOpenChange={setCompanySearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={companySearchOpen}
                        className="w-full justify-start h-11 text-base font-normal"
                      >
                        <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                        {formData.prospectCompany || "Search companies or create new..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" side="bottom" align="start">
                      <Command>
                        <CommandInput 
                          placeholder="Search companies..." 
                          value={companySearchValue}
                          onValueChange={setCompanySearchValue}
                        />
                        <CommandList>
                          <CommandEmpty>
                            <div className="p-4 text-center">
                              <p className="text-sm text-gray-600 mb-3">No companies found</p>
                              <Button 
                                size="sm" 
                                onClick={handleNewCompany}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Create new company
                              </Button>
                            </div>
                          </CommandEmpty>
                          <CommandGroup>
                            {filteredCompanies.map((company) => (
                              <CommandItem
                                key={company.id}
                                value={company.name}
                                onSelect={() => handleCompanySelect(company)}
                                className="flex items-center justify-between p-3 cursor-pointer"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <Briefcase className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{company.name}</p>
                                    <p className="text-xs text-gray-500">{company.industry}</p>
                                    <p className="text-xs text-gray-400">{company.contacts.length} contact{company.contacts.length !== 1 ? 's' : ''}</p>
                                  </div>
                                </div>
                                {formData.prospectCompany === company.name && (
                                  <Check className="h-4 w-4 text-green-600" />
                                )}
                              </CommandItem>
                            ))}
                            {companySearchValue && filteredCompanies.length > 0 && (
                              <CommandItem
                                onSelect={handleNewCompany}
                                className="border-t border-gray-100 p-3 cursor-pointer"
                              >
                                <div className="flex items-center space-x-3 w-full">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Plus className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">Create new company</p>
                                    <p className="text-xs text-gray-500">Add "{companySearchValue}" as new company</p>
                                  </div>
                                </div>
                              </CommandItem>
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Contact Search (appears after company selection) */}
                {formData.prospectCompany && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">
                      Contact Person <span className="text-red-500">*</span>
                    </Label>
                    {selectedCompany && selectedCompany.contacts.length > 0 ? (
                      <Popover open={contactSearchOpen} onOpenChange={setContactSearchOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={contactSearchOpen}
                            className="w-full justify-start h-11 text-base font-normal"
                          >
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            {formData.prospectName || "Select contact or create new..."}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" side="bottom" align="start">
                          <Command>
                            <CommandInput 
                              placeholder="Search contacts..." 
                              value={contactSearchValue}
                              onValueChange={setContactSearchValue}
                            />
                            <CommandList>
                              <CommandEmpty>
                                <div className="p-4 text-center">
                                  <p className="text-sm text-gray-600 mb-3">No contacts found</p>
                                  <Button 
                                    size="sm" 
                                    onClick={handleNewContact}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create new contact
                                  </Button>
                                </div>
                              </CommandEmpty>
                              <CommandGroup>
                                {filteredContacts.map((contact: any) => (
                                  <CommandItem
                                    key={contact.id}
                                    value={contact.name}
                                    onSelect={() => handleContactSelect(contact)}
                                    className="flex items-center justify-between p-3 cursor-pointer"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">{contact.name}</p>
                                        <p className="text-xs text-gray-500">{contact.email}</p>
                                        <p className="text-xs text-gray-400">{contact.title}</p>
                                      </div>
                                    </div>
                                    {formData.prospectName === contact.name && (
                                      <Check className="h-4 w-4 text-blue-600" />
                                    )}
                                  </CommandItem>
                                ))}
                                {contactSearchValue && (
                                  <CommandItem
                                    onSelect={handleNewContact}
                                    className="border-t border-gray-100 p-3 cursor-pointer"
                                  >
                                    <div className="flex items-center space-x-3 w-full">
                                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <Plus className="h-4 w-4 text-green-600" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">Create new contact</p>
                                        <p className="text-xs text-gray-500">Add "{contactSearchValue}" to {formData.prospectCompany}</p>
                                      </div>
                                    </div>
                                  </CommandItem>
                                )}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Input
                        value={formData.prospectName}
                        onChange={(e) => setFormData(prev => ({ ...prev, prospectName: e.target.value }))}
                        placeholder="Contact name"
                        className="h-11 text-base"
                        required
                      />
                    )}
                  </div>
                )}

                {/* Email field (manual entry or pre-filled) */}
                {formData.prospectName && (
                  <div className="space-y-2">
                    <Label htmlFor="prospect-email" className="text-sm font-medium text-gray-900">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="prospect-email"
                      type="email"
                      value={formData.prospectEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, prospectEmail: e.target.value }))}
                      placeholder="contact@company.com"
                      className="h-11 text-base"
                      required
                    />
                  </div>
                )}

                {/* Why Now Context */}
                <div className="space-y-2">
                  <Label htmlFor="why-now" className="text-sm font-medium text-gray-900">
                    Why Now? (Lease Context)
                  </Label>
                  <Textarea
                    id="why-now"
                    value={formData.whyNow}
                    onChange={(e) => setFormData(prev => ({ ...prev, whyNow: e.target.value }))}
                    placeholder="Current lease expires Q2 2024, looking to expand team by 50 employees..."
                    rows={4}
                    className="text-base"
                  />
                  <p className="text-xs text-gray-500">
                    Optional: Help us understand the prospect's timeline and motivation
                  </p>
                </div>

                {/* Selected Company & Contact Summary */}
                {formData.prospectCompany && formData.prospectName && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Selected Prospect</p>
                        <p className="text-sm text-green-700">{formData.prospectName} • {formData.prospectCompany}</p>
                        {formData.prospectEmail && (
                          <p className="text-sm text-green-600">{formData.prospectEmail}</p>
                        )}
                        {selectedCompany && (
                          <Badge variant="outline" className="mt-1 border-green-300 text-green-700 text-xs">
                            {selectedCompany.industry}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Scheduling Options</h3>
              <p className="text-gray-600">Choose how you'd like to schedule this tour with the prospect.</p>
            </div>
            
            {/* Scheduling Type Toggle */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant={formData.schedulingType === "manual" ? "default" : "outline"}
                  onClick={() => setFormData(prev => ({ ...prev, schedulingType: "manual" }))}
                  className={`h-16 text-left justify-start p-4 ${
                    formData.schedulingType === "manual" 
                      ? "bg-blue-600 hover:bg-blue-700 border-blue-600" 
                      : "border-2 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5" />
                    <div>
                      <div className="font-semibold">Set Time Manually</div>
                      <div className={`text-xs ${formData.schedulingType === "manual" ? "text-blue-100" : "text-gray-500"}`}>
                        Choose date and time now
                      </div>
                    </div>
                  </div>
                </Button>
                <Button
                  variant={formData.schedulingType === "link" ? "default" : "outline"}
                  onClick={() => setFormData(prev => ({ ...prev, schedulingType: "link" }))}
                  className={`h-16 text-left justify-start p-4 ${
                    formData.schedulingType === "link" 
                      ? "bg-blue-600 hover:bg-blue-700 border-blue-600" 
                      : "border-2 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <LinkIcon className="h-5 w-5" />
                    <div>
                      <div className="font-semibold">Send Scheduling Link</div>
                      <div className={`text-xs ${formData.schedulingType === "link" ? "text-blue-100" : "text-gray-500"}`}>
                        Let prospect pick time
                      </div>
                    </div>
                  </div>
                </Button>
              </div>

              {formData.schedulingType === "manual" ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Manual Scheduling</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Select Date</Label>
                      <Calendar
                        mode="single"
                        selected={formData.selectedDate || undefined}
                        onSelect={(date) => setFormData(prev => ({ ...prev, selectedDate: date || null }))}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                      />
                    </div>
                    
                    {formData.selectedDate && (
                      <div>
                        <Label>Suggested Time Slots</Label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {suggestedTimeSlots.map((time) => (
                            <Button
                              key={time}
                              variant={formData.selectedTime === time ? "default" : "outline"}
                              size="sm"
                              onClick={() => setFormData(prev => ({ ...prev, selectedTime: time }))}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Scheduling Link</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <LinkIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Let prospect pick time</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            A branded scheduling link will be generated using the broker's calendar.
                            The prospect will receive an email with available time slots.
                          </p>
                          <div className="mt-3 space-y-2 text-sm text-blue-600">
                            <div>✓ Syncs with {formData.brokerName || "broker"}'s calendar</div>
                            <div>✓ Respects building tour hours</div>
                            <div>✓ Shows suite availability</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Notes, Access & Collateral</h3>
              <p className="text-gray-600">Add internal notes, configure visitor access, and attach relevant documents.</p>
            </div>
            
            {/* Internal Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Internal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.internalNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, internalNotes: e.target.value }))}
                  placeholder="Internal leasing context, special requirements, follow-up notes..."
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Visitor Access Card */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center text-gray-900">
                  <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                  Visitor Access Management
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Configure mobile access and security credentials for the tour</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="send-visitor-access"
                    checked={formData.sendVisitorAccess}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendVisitorAccess: !!checked }))}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <div className="flex-1">
                    <Label htmlFor="send-visitor-access" className="text-base font-medium text-gray-900 cursor-pointer">
                      Send visitor access credentials
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Generate and send mobile access credentials, parking details, entry instructions, and onsite contact information to the prospect
                    </p>
                  </div>
                </div>
                
                {formData.sendVisitorAccess && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-blue-900 mb-2">Visitor Access Includes:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Mobile building access QR code</li>
                      <li>• Parking instructions and validation</li>
                      <li>• Reception desk and elevator directions</li>
                      <li>• Emergency contact information</li>
                      <li>• WiFi credentials for guest network</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Welcome Email Card */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center text-gray-900">
                  <Mail className="h-5 w-5 mr-2 text-green-600" />
                  Welcome Email Communication
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Send a branded welcome email with tour information and property details</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="send-welcome-email"
                    checked={formData.sendWelcomeEmail}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendWelcomeEmail: !!checked }))}
                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <div className="flex-1">
                    <Label htmlFor="send-welcome-email" className="text-base font-medium text-gray-900 cursor-pointer">
                      Send welcome email with tour information
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Send a professionally branded email with tour details, property marketing materials, and next steps
                    </p>
                  </div>
                </div>

                {formData.sendWelcomeEmail && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-green-900 mb-2">Welcome Email Includes:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Tour confirmation with date, time, and location</li>
                      <li>• Property marketing brochure and floor plans</li>
                      <li>• Broker contact information and direct line</li>
                      <li>• Link to online property portal</li>
                      <li>• Pre-tour questionnaire for space requirements</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Document Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upload Tour Documents (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload PDFs, DOCX, or images
                  </p>
                  <Button variant="outline" size="sm">
                    Choose Files
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Max 10MB per file • PDF, DOCX, JPG, PNG
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 6:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Review & Confirm</h3>
              <p className="text-gray-600">Review all tour details and confirm to create the tour.</p>
            </div>
            
            {/* Review Summary */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tour Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Buildings & Suites</Label>
                    <div className="mt-1 space-y-3">
                      {formData.selectedBuildings.map((building) => (
                        <div key={building.id}>
                          <p className="font-medium">{building.name}</p>
                          <p className="text-sm text-gray-600">{building.address}</p>
                        </div>
                      ))}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.selectedSuites.map((suite) => (
                          <Badge key={suite.id} variant="outline">
                            {suite.suite} • {formatNumber(suite.rsf)} RSF
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Broker</Label>
                      <p className="font-medium">{formData.brokerName}</p>
                      <p className="text-sm text-gray-600">{formData.brokerEmail}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Prospect</Label>
                      <p className="font-medium">{formData.prospectName}</p>
                      <p className="text-sm text-gray-600">{formData.prospectCompany}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Scheduling</Label>
                    {formData.schedulingType === "manual" ? (
                      <p className="font-medium">
                        {formData.selectedDate?.toLocaleDateString()} at {formData.selectedTime}
                      </p>
                    ) : (
                      <p className="font-medium">Scheduling link will be sent to prospect</p>
                    )}
                  </div>

                  {formData.sendVisitorAccess && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          Visitor access email will be sent
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="confirm-tour"
                  checked={formData.confirmed}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, confirmed: !!checked }))}
                />
                <Label htmlFor="confirm-tour" className="text-sm">
                  I confirm the tour details are correct and ready to proceed
                </Label>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 gap-0 [&>button]:hidden">
        <div className="flex flex-col h-screen">
          {/* Header */}
          <DialogHeader className="flex-shrink-0 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-semibold text-gray-900">Schedule New Tour</DialogTitle>
                <p className="text-sm text-gray-600 mt-1">Create and schedule property tours for prospects</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Step Progress */}
          <div className="flex-shrink-0 border-b border-gray-100 px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-center max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 aspect-square ${
                      currentStep >= step.number 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                        : currentStep === step.number - 1
                        ? 'border-blue-300 text-blue-600 bg-blue-50'
                        : 'border-gray-300 text-gray-400 bg-white'
                    }`}>
                      {currentStep > step.number ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-semibold">{step.number}</span>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium transition-colors duration-200 ${
                        currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        Step {step.number}
                      </p>
                      <p className={`text-xs ${
                        currentStep >= step.number ? 'text-blue-500' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`mx-6 w-12 h-0.5 transition-colors duration-200 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="max-w-4xl mx-auto px-6 py-8">
              {renderStepContent()}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-4 shadow-lg">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={onClose}>
                  Save as Draft
                </Button>
                {currentStep < 6 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStepValid()}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Create Tour
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { GlobalSearch } from "@/components/global-search"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, User, Building2, Users, Package, Check, Smartphone, Globe, MessageSquare, Mail, Upload, Plus, X } from "lucide-react"
import Link from "next/link"

type PersonType = "lead" | "tenant" | "staff" | "vendor"

type FormDataType = {
  email: string
  firstName: string
  lastName: string
  phone: string
  title: string
  company: string
  buildings: string
  note: string
}

type ChannelType = {
  id: string
  name: string
  description: string
  icon: any
  enabled: boolean
}

export default function AddPersonPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedType, setSelectedType] = useState<PersonType | null>(null)
  const [inputMode, setInputMode] = useState<"individual" | "bulk">("individual")
  const [userForms, setUserForms] = useState<FormDataType[]>([{
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    title: "",
    company: "",
    buildings: "",
    note: ""
  }])
  const [channels, setChannels] = useState<ChannelType[]>([
    {
      id: "mobile-app",
      name: "Mobile App",
      description: "Access to the HqO mobile application",
      icon: Smartphone,
      enabled: false
    },
    {
      id: "web-app",
      name: "Web App",
      description: "Access to the HqO web application",
      icon: Globe,
      enabled: false
    },
    {
      id: "text-messages",
      name: "Text Messages",
      description: "Receive SMS notifications and updates",
      icon: MessageSquare,
      enabled: false
    },
    {
      id: "email",
      name: "Email Communications",
      description: "Receive email notifications and updates",
      icon: Mail,
      enabled: true // Default enabled
    }
  ])

  const personTypes = [
    {
      id: "lead" as PersonType,
      title: "Lead",
      description: "Add a prospect, broker, or anyone associated with your building who is not a tenant.",
      icon: User,
    },
    {
      id: "tenant" as PersonType,
      title: "Tenant",
      description: "Employees, executives, and any other person who works for building.",
      icon: Building2,
    },
    {
      id: "staff" as PersonType,
      title: "Staff",
      description: "Invite a LANDLORD, ADMIN, MANAGER to the HqO platform.",
      icon: Users,
    },
    {
      id: "vendor" as PersonType,
      title: "Vendor",
      description: "Add a vendor point of contact to the system.",
      icon: Package,
    }
  ]

  const steps = [
    { id: 1, name: "Type", description: "Select person type" },
    { id: 2, name: "Information", description: "Enter details" },
    { id: 3, name: "Channels", description: "Configure access" },
  ]

  const handleInputChange = (formIndex: number, field: string, value: string) => {
    setUserForms(prev => prev.map((form, index) => 
      index === formIndex ? { ...form, [field]: value } : form
    ))
  }

  const addUserForm = () => {
    setUserForms(prev => [...prev, {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      title: "",
      company: "",
      buildings: "",
      note: ""
    }])
  }

  const removeUserForm = (formIndex: number) => {
    if (userForms.length > 1) {
      setUserForms(prev => prev.filter((_, index) => index !== formIndex))
    }
  }

  const handleChannelToggle = (channelId: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId 
        ? { ...channel, enabled: !channel.enabled }
        : channel
    ))
  }

  const canProceedFromStep = (step: number) => {
    switch (step) {
      case 1:
        return selectedType !== null
      case 2:
        if (inputMode === "bulk") {
          return true // Allow proceeding if bulk mode is selected
        }
        // For individual mode, check that at least one form is complete
        return userForms.some(form => 
          form.email && form.firstName && form.lastName && form.company
        )
      case 3:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceedFromStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form Data:", { selectedType, userForms, channels, inputMode })
    // In real app, this would make an API call
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep > step.id 
                ? "bg-green-600 text-white" 
                : currentStep === step.id 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-600"
            }`}>
              {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
            </div>
            <div className="mt-2 text-center">
              <div className={`text-sm font-medium ${
                currentStep >= step.id ? "text-gray-900" : "text-gray-500"
              }`}>
                {step.name}
              </div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-4 ${
              currentStep > step.id ? "bg-green-600" : "bg-gray-200"
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
      {personTypes.map((type) => {
        const Icon = type.icon
        const isSelected = selectedType === type.id
        return (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected
                ? "ring-2 ring-blue-500 bg-blue-50"
                : "hover:bg-gray-50"
            }`}
            onClick={() => setSelectedType(type.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  isSelected ? "bg-blue-100" : "bg-gray-100"
                }`}>
                  <Icon className={`h-6 w-6 ${
                    isSelected ? "text-blue-600" : "text-gray-600"
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{type.title}</h3>
                    {isSelected && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  const renderStep2 = () => (
    <div>
      {/* Input Mode Selection */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={inputMode === "individual" ? "default" : "outline"}
            onClick={() => setInputMode("individual")}
            className="flex items-center space-x-2"
          >
            <User className="h-4 w-4" />
            <span>Individual</span>
          </Button>
          <Button
            variant={inputMode === "bulk" ? "default" : "outline"}
            onClick={() => setInputMode("bulk")}
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Bulk upload</span>
          </Button>
        </div>
      </div>

        {inputMode === "individual" ? (
          <div className="max-w-2xl mx-auto space-y-8">
            {userForms.map((form, formIndex) => (
              <Card key={formIndex} className="relative">
                <CardContent className="p-6">
                  {userForms.length > 1 && (
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Person {formIndex + 1}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUserForm(formIndex)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`email-${formIndex}`}>Email address *</Label>
                        <Input
                          id={`email-${formIndex}`}
                          type="email"
                          placeholder="john.smith@company.com"
                          value={form.email}
                          onChange={(e) => handleInputChange(formIndex, "email", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`phone-${formIndex}`}>Phone number</Label>
                        <div className="flex mt-1">
                          <div className="flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md">
                            <span className="text-sm">🇺🇸</span>
                            <span className="text-sm ml-1">+1</span>
                          </div>
                          <Input
                            id={`phone-${formIndex}`}
                            placeholder="(555) 123-4567"
                            value={form.phone}
                            onChange={(e) => handleInputChange(formIndex, "phone", e.target.value)}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`firstName-${formIndex}`}>First name *</Label>
                        <Input
                          id={`firstName-${formIndex}`}
                          placeholder="John"
                          value={form.firstName}
                          onChange={(e) => handleInputChange(formIndex, "firstName", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`lastName-${formIndex}`}>Last name *</Label>
                        <Input
                          id={`lastName-${formIndex}`}
                          placeholder="Smith"
                          value={form.lastName}
                          onChange={(e) => handleInputChange(formIndex, "lastName", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`title-${formIndex}`}>Job title</Label>
                        <Input
                          id={`title-${formIndex}`}
                          placeholder="Software Engineer"
                          value={form.title}
                          onChange={(e) => handleInputChange(formIndex, "title", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`company-${formIndex}`}>Company *</Label>
                        <Select onValueChange={(value) => handleInputChange(formIndex, "company", value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select company" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="acme-corp">Acme Corporation</SelectItem>
                            <SelectItem value="tech-solutions">Tech Solutions Inc</SelectItem>
                            <SelectItem value="global-ventures">Global Ventures LLC</SelectItem>
                            <SelectItem value="new-company">+ Add new company</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`buildings-${formIndex}`}>Buildings</Label>
                      <Select onValueChange={(value) => handleInputChange(formIndex, "buildings", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select buildings" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tower-one">Tower One</SelectItem>
                          <SelectItem value="plaza-building">Plaza Building</SelectItem>
                          <SelectItem value="corporate-center">Corporate Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`note-${formIndex}`}>Additional notes</Label>
                      <textarea
                        id={`note-${formIndex}`}
                        placeholder="Add any additional notes about this person..."
                        value={form.note}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(formIndex, "note", e.target.value)}
                        className="mt-1 flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add Another User Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={addUserForm}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add another user</span>
              </Button>
            </div>
          </div>
        ) : (
          /* Bulk Upload Mode */
          <div className="max-w-2xl mx-auto">
            <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
              <CardContent className="p-8">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload CSV file</h3>
                  <p className="text-gray-600 mb-4">
                    Upload a CSV file with user information. Make sure your file includes columns for 
                    email, first name, last name, and company.
                  </p>
                  <div className="space-y-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose file
                    </Button>
                    <div className="text-sm text-gray-500">
                      <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                        Download sample CSV template
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">CSV format requirements</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your CSV file should include these columns: Email (required), First Name (required), 
                    Last Name (required), Phone, Job Title, Company (required), Buildings, Notes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )

  const renderStep3 = () => (
    <Card>
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Configure access channels</h2>
          <p className="text-gray-600">Choose which communication channels and apps this person can access</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {channels.map((channel) => {
            const Icon = channel.icon
            return (
              <Card key={channel.id} className={`transition-all ${
                channel.enabled ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      id={channel.id}
                      checked={channel.enabled}
                      onCheckedChange={() => handleChannelToggle(channel.id)}
                    />
                    <div className={`p-2 rounded-lg ${
                      channel.enabled ? "bg-blue-100" : "bg-gray-100"
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        channel.enabled ? "text-blue-600" : "text-gray-600"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={channel.id} className="cursor-pointer">
                        <div className="font-medium text-gray-900">{channel.name}</div>
                        <div className="text-sm text-gray-600">{channel.description}</div>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/people">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  People
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <GlobalSearch />
              <Button variant="outline" onClick={() => {
                setCurrentStep(1)
                setSelectedType(null)
                setUserForms([{
                  email: "",
                  firstName: "",
                  lastName: "",
                  phone: "",
                  title: "",
                  company: "",
                  buildings: "",
                  note: ""
                }])
                setChannels(prev => prev.map(c => ({ ...c, enabled: c.id === "email" })))
              }}>
                Start over
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {renderStepIndicator()}
            
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceedFromStep(currentStep)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Add person
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
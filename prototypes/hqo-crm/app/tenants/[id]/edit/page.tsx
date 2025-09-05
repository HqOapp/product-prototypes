"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Check, X } from "lucide-react"
import Link from "next/link"

interface TenantEditPageProps {
  params: {
    id: string
  }
}

export default function TenantEditPage({ params }: TenantEditPageProps) {
  const [currentStep, setCurrentStep] = useState("company")

  const steps = [
    { id: "company", name: "Company", completed: true },
    { id: "space", name: "Space", completed: true },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/tenants/${params.id}`} className="flex items-center text-gray-600 hover:text-gray-900">
                <ChevronLeft className="h-5 w-5 mr-1" />
                Tenants
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900">EcoVolt Energy Solutions</h1>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Left Sidebar - Steps */}
          <div className="w-64 bg-white border-r p-6">
            <div className="space-y-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    currentStep === step.id
                      ? "bg-blue-50 border-l-4 border-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    step.completed 
                      ? "bg-green-600 text-white"
                      : currentStep === step.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {step.completed ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-medium">
                        {steps.findIndex(s => s.id === step.id) + 1}
                      </span>
                    )}
                  </div>
                  <span className={`font-medium ${
                    currentStep === step.id ? "text-blue-600" : "text-gray-700"
                  }`}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {currentStep === "company" && (
              <div className="max-w-2xl">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Company info</h2>
                  <p className="text-gray-600">General information about the tenant company</p>
                </div>

                <div className="space-y-6">
                  {/* Display Name */}
                  <div>
                    <Label htmlFor="displayName" className="text-sm font-medium text-gray-700">
                      Display name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="displayName"
                      defaultValue="EcoVolt Energy Solutions"
                      className="mt-1"
                    />
                  </div>

                  {/* Billing Address */}
                  <div>
                    <Label htmlFor="billingAddress" className="text-sm font-medium text-gray-700">
                      Billing address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="billingAddress"
                      defaultValue="162 E Berkeley St, Boston, MA 02118, USA"
                      className="mt-1"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      defaultValue="EcoVolt Energy Solutions innovates in the Renewable Electricity industry, focusing on sustainable energy generation and storage from wind, solar, and more. We aim to provide clean electricity, reduce carbon footprints, and promote energy independence, driving towards a greener future."
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <Label htmlFor="industry" className="text-sm font-medium text-gray-700">
                      Industry
                    </Label>
                    <Select defaultValue="renewables">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="renewables">Renewables & Environment</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Website */}
                  <div>
                    <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                      Website
                    </Label>
                    <Input
                      id="website"
                      defaultValue="https://www.ecovolt.io"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter a valid URL, including http:// or https://
                    </p>
                  </div>

                  {/* Logo */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Logo</Label>
                    <Card className="mt-1 border-2 border-dashed border-gray-300 relative">
                      <CardContent className="p-8 text-center">
                        <div className="flex justify-center mb-4">
                          <div className="w-20 h-20 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <button className="absolute top-2 right-2 p-1 bg-gray-100 rounded-full hover:bg-gray-200">
                          <X className="h-4 w-4 text-gray-600" />
                        </button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "space" && (
              <div className="max-w-2xl">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Space info</h2>
                  <p className="text-gray-600">Information about the tenant's space allocation</p>
                </div>

                <div className="space-y-6">
                  {/* Building Assignment */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Building assignment <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Cobblestone Collaborative</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Metro Tower</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Innovation Hub</span>
                      </div>
                    </div>
                  </div>

                  {/* Floor */}
                  <div>
                    <Label htmlFor="floor" className="text-sm font-medium text-gray-700">
                      Floor
                    </Label>
                    <Input
                      id="floor"
                      defaultValue="5th Floor"
                      className="mt-1"
                    />
                  </div>

                  {/* Square Footage */}
                  <div>
                    <Label htmlFor="squareFootage" className="text-sm font-medium text-gray-700">
                      Square footage
                    </Label>
                    <Input
                      id="squareFootage"
                      defaultValue="12,500 sq ft"
                      className="mt-1"
                    />
                  </div>

                  {/* Lease Start Date */}
                  <div>
                    <Label htmlFor="leaseStart" className="text-sm font-medium text-gray-700">
                      Lease start date
                    </Label>
                    <Input
                      id="leaseStart"
                      type="date"
                      defaultValue="2023-01-15"
                      className="mt-1"
                    />
                  </div>

                  {/* Lease End Date */}
                  <div>
                    <Label htmlFor="leaseEnd" className="text-sm font-medium text-gray-700">
                      Lease end date
                    </Label>
                    <Input
                      id="leaseEnd"
                      type="date"
                      defaultValue="2025-12-31"
                      className="mt-1"
                    />
                  </div>

                  {/* Monthly Rent */}
                  <div>
                    <Label htmlFor="monthlyRent" className="text-sm font-medium text-gray-700">
                      Monthly rent
                    </Label>
                    <Input
                      id="monthlyRent"
                      defaultValue="$28,750"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
"use client"

import { Check, Monitor } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useCustomerMode, type CustomerMode } from "@/lib/providers/customer-mode-provider"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

const modes = [
  {
    id: "generic" as CustomerMode,
    name: "Generic",
    description: "Default mode for general demonstrations",
  },
  {
    id: "piedmont" as CustomerMode,
    name: "Piedmont",
    description: "Customized mode for Piedmont-specific demonstrations",
  },
  {
    id: "ocvibe" as CustomerMode,
    name: "OCVibe",
    description: "Customized mode for OCVibe-specific demonstrations",
  },
  {
    id: "cousins" as CustomerMode,
    name: "Cousins",
    description: "Customized mode for Cousins-specific demonstrations",
  },
]

export default function AdminModePage() {
  const { currentMode, setMode } = useCustomerMode()

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-auto px-6 py-6">
          <div className="max-w-2xl">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Monitor className="h-6 w-6 text-gray-600" />
                <h1 className="text-2xl font-bold text-gray-900">Customer Mode</h1>
              </div>
              <p className="text-gray-600">
                Select the customer mode for demonstrations. This affects logos, branding, and personalized content throughout the CRM.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Demo Mode Selection</CardTitle>
                <CardDescription>
                  Choose the appropriate mode for your demonstration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modes.map((mode) => (
                    <div key={mode.id} className="flex items-start space-x-3">
                      <input
                        type="radio"
                        id={mode.id}
                        name="customerMode"
                        value={mode.id}
                        checked={currentMode === mode.id}
                        onChange={(e) => setMode(e.target.value as CustomerMode)}
                        className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <Label 
                          htmlFor={mode.id}
                          className="font-medium text-gray-900 cursor-pointer flex items-center gap-2"
                        >
                          {mode.name}
                          {currentMode === mode.id && (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                        </Label>
                        <p className="text-sm text-gray-500 mt-1">
                          {mode.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Current Mode: {modes.find(m => m.id === currentMode)?.name}
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Mode changes are applied immediately and persist during your session.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
"use client"

import { Sidebar } from "@/components/sidebar"
import { GlobalSearch } from "@/components/global-search"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Plus, DollarSign, TrendingUp, Calendar, Receipt } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("transactions")
  const paymentTabs = [
    { id: "transactions", label: "Transactions", count: 0 },
    { id: "credits", label: "Credits", count: 0 },
    { id: "discounts", label: "Discounts", count: 0 },
  ]
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4">
          <div className="page-header">
            <div>
              <h1 className="page-title">Payments</h1>
              <p className="page-subtitle">Manage rent payments, invoices, and financial transactions</p>
            </div>
            <div className="flex items-center space-x-4">
              <GlobalSearch />
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-auto p-0 bg-transparent">
              {paymentTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent px-4 py-3"
                >
                  {tab.label}
                  <Badge variant="secondary" className="ml-2 text-xs">{tab.count}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto page-container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="transactions">
              {/* Summary Cards */}
              <div className="card-grid-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total revenue</p>
                        <p className="text-2xl font-bold">$0</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Outstanding</p>
                        <p className="text-2xl font-bold">$0</p>
                      </div>
                      <Calendar className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">This month</p>
                        <p className="text-2xl font-bold">$0</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total invoices</p>
                        <p className="text-2xl font-bold">0</p>
                      </div>
                      <Receipt className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Empty State */}
              <Card>
                <CardContent className="p-12">
                  <div className="text-center">
                    <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Start managing your building's financial transactions by creating invoices, tracking rent payments, and monitoring revenue.
                    </p>
                    <div className="flex items-center justify-center space-x-4">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Invoice
                      </Button>
                      <Button variant="outline">
                        <Receipt className="h-4 w-4 mr-2" />
                        View Reports
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="credits">
              <Card>
                <CardContent className="p-12">
                  <div className="text-center">
                    <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No credits yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Credits will appear here when they are issued or applied to tenant accounts.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="discounts">
              <Card>
                <CardContent className="p-12">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No discounts yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Discounts will appear here when they are created or applied to tenant accounts.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 
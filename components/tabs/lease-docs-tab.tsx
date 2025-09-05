import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText, ChevronDown, Edit, Eye } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LeaseDocsTabProps {
  selectedBuildings: string[]
}

export function LeaseDocsTab({ selectedBuildings }: LeaseDocsTabProps) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Lease - LS-2023-001 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center font-normal text-xl">
                  
                  LS-2023-001 - Cobblestone Collaborative
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">Executed</Badge>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500">Jan 15, 2023 - Jan 14, 2026 • Floor 9 - Suite 901</p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="parties">Parties</TabsTrigger>
                  <TabsTrigger value="premises">Premises</TabsTrigger>
                  <TabsTrigger value="rent">Rent</TabsTrigger>
                  <TabsTrigger value="operations">Operations</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Lease Type</span>
                      <div className="font-medium">Triple Net (NNN)</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Lease Status</span>
                      <div className="font-medium">Executed</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Effective Date</span>
                      <div className="font-medium">Jan 15, 2023</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Execution Date</span>
                      <div className="font-medium">Jan 10, 2023</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Commencement Date</span>
                      <div className="font-medium">Jan 15, 2023</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Rent Commencement</span>
                      <div className="font-medium">Mar 1, 2023</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Expiration Date</span>
                      <div className="font-medium">Jan 14, 2026</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Possession Date</span>
                      <div className="font-medium">Jan 15, 2023</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Lease Term</span>
                      <div className="font-medium">36 Months</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Early Occupancy</span>
                      <div className="font-medium">Yes - 30 days prior</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Renewal Options</span>
                      <div className="font-medium">2 x 5 years</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Expansion Options</span>
                      <div className="font-medium">Adjacent 5,000 SF</div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Rights & Options</h4>
                    <div className="space-y-2">
                      <Collapsible>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded">
                          <span className="text-sm font-medium">Termination Options</span>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-2 text-sm text-gray-600">
                          Tenant may terminate lease with 6 months notice and payment of 3 months rent penalty after
                          year 2.
                        </CollapsibleContent>
                      </Collapsible>

                      <Collapsible>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded">
                          <span className="text-sm font-medium">ROFO/ROFR Rights</span>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-2 text-sm text-gray-600">
                          Right of first refusal on adjacent spaces. 30-day notification period required.
                        </CollapsibleContent>
                      </Collapsible>

                      <Collapsible>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded">
                          <span className="text-sm font-medium">Sublease Rights</span>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-2 text-sm text-gray-600">
                          Tenant may sublease up to 25% of space with landlord approval, not to be unreasonably
                          withheld.
                        </CollapsibleContent>
                      </Collapsible>

                      <Collapsible>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded">
                          <span className="text-sm font-medium">Assignment Rights</span>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-2 text-sm text-gray-600">
                          Assignment permitted to affiliates or entities with net worth exceeding $10M.
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="parties" className="mt-4">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Primary Parties</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Tenant Legal Entity</span>
                          <div className="font-medium">EcoVolt Energy Solutions, Inc.</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Landlord Legal Entity</span>
                          <div className="font-medium">Cobblestone Properties LLC</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Guarantor(s)</span>
                          <div className="font-medium">Alex Morgan (Personal Guarantee)</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Property Manager</span>
                          <div className="font-medium">Quantum City Investments</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Brokers</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Landlord Rep</span>
                          <div className="font-medium">CBRE - Sarah Johnson</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Tenant Rep</span>
                          <div className="font-medium">JLL - Michael Chen</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Legal Notice Contacts</h4>
                      <div className="space-y-3">
                        <div className="p-3 border rounded">
                          <div className="font-medium">Tenant Notice Address</div>
                          <div className="text-sm text-gray-600">
                            EcoVolt Energy Solutions, Inc.
                            <br />
                            Attn: Alex Morgan, CEO
                            <br />
                            123 Innovation Drive, Suite 901
                            <br />
                            San Francisco, CA 94105
                          </div>
                        </div>
                        <div className="p-3 border rounded">
                          <div className="font-medium">Landlord Notice Address</div>
                          <div className="text-sm text-gray-600">
                            Cobblestone Properties LLC
                            <br />
                            Attn: Legal Department
                            <br />
                            456 Property Lane
                            <br />
                            San Francisco, CA 94102
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="premises" className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Building Name</span>
                      <div className="font-medium">Cobblestone Collaborative</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Building Address</span>
                      <div className="font-medium">123 Innovation Drive</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Floor(s)</span>
                      <div className="font-medium">9th Floor</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Suite Number(s)</span>
                      <div className="font-medium">Suite 901</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Rentable Area (RSF)</span>
                      <div className="font-medium">15,000 SF</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Usable Area (USF)</span>
                      <div className="font-medium">13,500 SF</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Load Factor</span>
                      <div className="font-medium">11.1%</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Measurement Method</span>
                      <div className="font-medium">BOMA 2017</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Parking Spaces</span>
                      <div className="font-medium">45 spaces</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Storage Space</span>
                      <div className="font-medium">500 SF</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="rent" className="mt-4">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Base Rent & Escalations</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Base Rent (Annual)</span>
                          <div className="font-medium">$487,500</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Base Rent (Per SF)</span>
                          <div className="font-medium">$32.50</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Rent Escalations</span>
                          <div className="font-medium">3% annually</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Free Rent Period</span>
                          <div className="font-medium">2 months</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Rent Abatement</span>
                          <div className="font-medium">$81,250 (2 months)</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Payment Frequency</span>
                          <div className="font-medium">Monthly</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Additional Charges</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">OPEX Base Year</span>
                          <div className="font-medium">2023</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">OPEX Cap</span>
                          <div className="font-medium">5% annually</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">RE Tax Base Year</span>
                          <div className="font-medium">2023</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">CAM Charges</span>
                          <div className="font-medium">Pro rata share</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Security & Penalties</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Security Deposit</span>
                          <div className="font-medium">$75,000</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Security Type</span>
                          <div className="font-medium">Cash</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Late Payment Penalty</span>
                          <div className="font-medium">5% after 10 days</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Tenant Improvements</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">TI Allowance</span>
                          <div className="font-medium">$75/SF ($1,125,000)</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">TI Scope</span>
                          <div className="font-medium">Turnkey</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Construction Period</span>
                          <div className="font-medium">90 days</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Work Letter</span>
                          <div className="font-medium">Yes - Exhibit C</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="operations" className="mt-4">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Use & Access</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Permitted Use</span>
                          <div className="font-medium">General Office</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Building Hours</span>
                          <div className="font-medium">6 AM - 10 PM</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">24/7 Access</span>
                          <div className="font-medium">Yes</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Signage Rights</span>
                          <div className="font-medium">Suite entry only</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Exclusive Use</span>
                          <div className="font-medium">Conference Room A</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Maintenance & Services</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">HVAC Maintenance</span>
                          <div className="font-medium">Landlord</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Janitorial Services</span>
                          <div className="font-medium">Landlord provided</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">After-Hours HVAC</span>
                          <div className="font-medium">$25/hour</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Utilities</span>
                          <div className="font-medium">Tenant direct pay</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Insurance & Compliance</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">General Liability</span>
                          <div className="font-medium">$2M per occurrence</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Property Insurance</span>
                          <div className="font-medium">Full replacement cost</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">ADA Compliance</span>
                          <div className="font-medium">Tenant responsibility</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Special Clauses</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Holdover Rate</span>
                          <div className="font-medium">150% of base rent</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Co-Tenancy</span>
                          <div className="font-medium">N/A</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Most Favored Nations</span>
                          <div className="font-medium">No</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Primary Documents</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">Master Lease Agreement.pdf</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">Letter of Intent.pdf</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Exhibits</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Exhibit A - Premises Plan.pdf</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Exhibit B - Base Building Description.pdf</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Exhibit C - Work Letter.pdf</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Exhibit D - Rules and Regulations.pdf</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Amendments & Modifications</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-orange-600" />
                            <span className="text-sm">First Amendment - Expansion.pdf</span>
                            <Badge variant="outline" className="text-xs">
                              Mar 2023
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Second Lease - LS-2023-002 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-xl font-normal">
                  
                  LS-2023-002 - Cobblestone Collaborative
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500">Mar 01, 2023 - Feb 28, 2025 • Floor 8 - Suite 801</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Lease Type</span>
                  <div className="font-medium">Modified Gross</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Base Rent (Per SF)</span>
                  <div className="font-medium">$28.00</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Square Footage</span>
                  <div className="font-medium">12,475 SF</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Escalations</span>
                  <div className="font-medium">2.5% annually</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Security Deposit</span>
                  <div className="font-medium">$50,000</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Annual Rent</span>
                  <div className="font-medium">$349,300</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Full Details
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Portfolio Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="font-normal text-xl">Portfolio Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total Square Footage</span>
                  <span className="font-medium">27,475 sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Annual Rent</span>
                  <span className="font-medium">$836,800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Rate</span>
                  <span className="font-medium">$30.45 per sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Leases</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Security Deposits</span>
                  <span className="font-medium">$125,000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lease Expiration Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="font-normal text-xl">Lease Expiration Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <div>
                    <div className="text-sm font-medium">Suite 801</div>
                    <div className="text-xs text-gray-500">12,475 sq ft</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">Feb 2025</div>
                    <div className="text-xs text-yellow-600">8 months</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div>
                    <div className="text-sm font-medium">Suite 901</div>
                    <div className="text-xs text-gray-500">15,000 sq ft</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">Jan 2026</div>
                    <div className="text-xs text-green-600">1.5 years</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-normal">Upcoming Critical Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-2 border-l-4 border-orange-500 bg-orange-50">
                  <div className="text-sm font-medium">Renewal Option Exercise</div>
                  <div className="text-xs text-gray-600">Suite 901 - Due Jan 14, 2025</div>
                </div>
                <div className="p-2 border-l-4 border-blue-500 bg-blue-50">
                  <div className="text-sm font-medium">OPEX Reconciliation</div>
                  <div className="text-xs text-gray-600">Both suites - Due Mar 31, 2024</div>
                </div>
                <div className="p-2 border-l-4 border-green-500 bg-green-50">
                  <div className="text-sm font-medium">Insurance Certificate</div>
                  <div className="text-xs text-gray-600">Renewal due Jun 15, 2024</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

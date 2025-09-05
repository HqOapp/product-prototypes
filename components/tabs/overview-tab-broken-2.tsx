"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InlineEdit } from "@/components/ui/inline-edit";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MessageSquare,
  Ticket,
  FileQuestion,
  UserPlus,
  CreditCard,
  Calendar,
  Mail,
  FileText,
  User,
} from "lucide-react";

interface OverviewTabProps {
  selectedBuildings: string[];
  onTabChange?: (tabId: string) => void;
  onOpenContactNotes?: (contact: any) => void;
}

export function OverviewTab({
  selectedBuildings,
  onTabChange,
  onOpenContactNotes,
}: OverviewTabProps) {
  // Mock contact data for the overview
  const mockContacts = [
    {
      id: "alex-morgan",
      name: "Alex Morgan",
      building: "55 Arch",
      avatar: "AM",
      notesCount: 3,
    },
    {
      id: "sarah-johnson",
      name: "Sarah Johnson",
      building: "55 Arch",
      avatar: "SJ",
      notesCount: 1,
    },
    {
      id: "michael-chen",
      name: "Michael Chen",
      building: "55 Arch",
      avatar: "MC",
      notesCount: 0,
    },
  ];

  // State for editable fields
  const [tenantData, setTenantData] = useState({
    description:
      "Contrast AI innovates in the Renewable Electricity industry, focusing on sustainable energy generation and storage from wind, solar, and more. We aim to provide clean electricity, reduce carbon footprints, and promote energy independence, driving towards a greener future.",
    industry: "Computer Software",
    billingAddress: "162 E Berkeley St\nBoston, MA 02118",
    website: "contrastai.com",
    employees: "25,000",
    domains: "contrastai.com, contrast.ai",
    creationDate: "March 7, 2022 at 11:02 AM",
  });

  const handleFieldUpdate = (field: keyof typeof tenantData, value: string) => {
    setTenantData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // In a real app, you would also make an API call here to save the data
    console.log(`Updated ${field}:`, value);
  };

  return (
    <div className="flex gap-6 p-6">
      {/* Left Sidebar - Details */}
      <div className="w-[347px] flex-shrink-0">
        <Card className="bg-white border border-[#eaecee] rounded-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-[#2d3338] text-[16px] font-medium leading-[24px]">
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            <div>
              <InlineEdit
                value={tenantData.description}
                onSave={(value) => handleFieldUpdate("description", value)}
                multiline={true}
                placeholder="Enter company description..."
                displayClassName="text-[#696e72] text-[14px] leading-[20px] font-normal"
              />
            </div>

            {/* Industry */}
            <div className="space-y-1">
              <InlineEdit
                value={tenantData.industry}
                onSave={(value) => handleFieldUpdate("industry", value)}
                placeholder="Enter industry..."
                displayClassName="text-[#2d3338] text-[16px] font-normal leading-[24px]"
              />
              <div className="text-[#696e72] text-[14px] font-normal leading-[20px]">
                Industry
              </div>
            </div>

            {/* Billing Address */}
            <div className="space-y-1">
              <InlineEdit
                value={tenantData.billingAddress}
                onSave={(value) => handleFieldUpdate("billingAddress", value)}
                multiline={true}
                placeholder="Enter billing address..."
                displayClassName="text-[#2d3338] text-[16px] font-normal leading-[24px] whitespace-pre-line"
              />
              <div className="text-[#696e72] text-[14px] font-normal leading-[20px]">
                Billing Address
              </div>
            </div>

            {/* Website */}
            <div className="space-y-1">
              <InlineEdit
                value={tenantData.website}
                onSave={(value) => handleFieldUpdate("website", value)}
                placeholder="Enter website..."
                displayClassName="text-[#2d3338] text-[16px] font-normal leading-[24px]"
              />
              <div className="text-[#696e72] text-[14px] font-normal leading-[20px]">
                Website
              </div>
            </div>

            {/* Employees */}
            <div className="space-y-1">
              <InlineEdit
                value={tenantData.employees}
                onSave={(value) => handleFieldUpdate("employees", value)}
                placeholder="Enter employee count..."
                displayClassName="text-[#2d3338] text-[16px] font-normal leading-[24px]"
              />
              <div className="text-[#696e72] text-[14px] font-normal leading-[20px]">
                Employees
              </div>
            </div>

            {/* Domains */}
            <div className="space-y-1">
              <InlineEdit
                value={tenantData.domains}
                onSave={(value) => handleFieldUpdate("domains", value)}
                placeholder="Enter domains..."
                displayClassName="text-[#2d3338] text-[16px] font-normal leading-[24px]"
              />
              <div className="text-[#696e72] text-[14px] font-normal leading-[20px]">
                Domains
              </div>
            </div>

            {/* Creation Date */}
            <div className="space-y-1">
              <InlineEdit
                value={tenantData.creationDate}
                onSave={(value) => handleFieldUpdate("creationDate", value)}
                placeholder="Enter creation date..."
                displayClassName="text-[#2d3338] text-[16px] font-normal leading-[24px]"
              />
              <div className="text-[#696e72] text-[14px] font-normal leading-[20px]">
                Creation Date
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Main Content */}
      <div className="flex-1 space-y-6">
        {/* Contacts Section */}
        <Card className="bg-white border border-[#eaecee] rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <CardTitle className="text-[#2d3338] text-[16px] font-medium leading-[24px]">
              Contacts
            </CardTitle>
            <Button
              variant="link"
              className="text-[#044aef] text-[14px] font-medium p-0 h-auto"
              onClick={() => onTabChange?.("contacts")}
            >
              View all contacts
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {mockContacts.map((contact, index) => (
                <div
                  key={contact.id}
                  className={`flex items-center justify-between py-4 ${index < mockContacts.length - 1 ? "border-b border-[#eaecee]" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 bg-[#f6f7f8] rounded-full">
                      <AvatarFallback className="text-[#696e72] text-[14px] font-medium">
                        {contact.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-[#2d3338] text-[14px] font-medium leading-[20px]">
                        {contact.name}
                      </div>
                      <div className="text-[#696e72] text-[14px] font-normal leading-[20px]">
                        {contact.building}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Send email</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 relative"
                            onClick={() => onOpenContactNotes?.(contact)}
                          >
                            <FileText className="h-4 w-4" />
                            {contact.notesCount > 0 && (
                              <Badge className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0 flex items-center justify-center min-w-[20px]"
                                style={{backgroundColor: '#EBF1FF', color: '#044aef'}}">
                                {contact.notesCount}
                              </Badge>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View or add notes</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <User className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View profile</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Section */}
        <Card className="bg-white border border-[#eaecee] rounded-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-[#2d3338] text-[16px] font-medium leading-[24px]">
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Activity Item 1 */}
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-[#044aef] rounded-full mt-3 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-[#2d3338] text-[14px] font-medium leading-[20px] mb-1">
                  Submitted survey response
                </div>
                <div className="text-[#696e72] text-[14px] font-normal leading-[20px] mb-2">
                  Responded to "Q1 2024 Tenant Satisfaction Survey"
                </div>
                <div className="text-[#696e72] text-[12px] font-normal leading-[16px]">
                  2 hours ago
                </div>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="flex items-start gap-4">
              <div className="w-px h-4 bg-[#eaecee] ml-1 flex-shrink-0"></div>
              <div className="flex-1"></div>
            </div>

            {/* Activity Item 2 */}
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-[#044aef] rounded-full mt-3 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-[#2d3338] text-[14px] font-medium leading-[20px] mb-1">
                  Registered for event
                </div>
                <div className="text-[#696e72] text-[14px] font-normal leading-[20px] mb-2">
                  Signed up for "Sustainability Workshop"
                </div>
                <div className="text-[#696e72] text-[12px] font-normal leading-[16px]">
                  1 day ago
                </div>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="flex items-start gap-4">
              <div className="w-px h-4 bg-[#eaecee] ml-1 flex-shrink-0"></div>
              <div className="flex-1"></div>
            </div>

            {/* Activity Item 3 */}
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-[#044aef] rounded-full mt-3 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-[#2d3338] text-[14px] font-medium leading-[20px] mb-1">
                  Updated contact information
                </div>
                <div className="text-[#696e72] text-[14px] font-normal leading-[20px] mb-2">
                  Changed email address for Alex Morgan
                </div>
                <div className="text-[#696e72] text-[12px] font-normal leading-[16px]">
                  3 days ago
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buildings Section */}
        <Card className="bg-white border border-[#eaecee] rounded-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-[#2d3338] text-[16px] font-medium leading-[24px]">
              Buildings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Header Row */}
              <div className="grid grid-cols-4 gap-4 pb-2 border-b border-[#eaecee]">
                <div className="text-[#696e72] text-[12px] font-medium leading-[16px] uppercase tracking-wide">
                  BUILDING
                </div>
                <div className="text-[#696e72] text-[12px] font-medium leading-[16px] uppercase tracking-wide">
                  FLOORS
                </div>
                <div className="text-[#696e72] text-[12px] font-medium leading-[16px] uppercase tracking-wide">
                  SUITES
                </div>
                <div className="text-[#696e72] text-[12px] font-medium leading-[16px] uppercase tracking-wide">
                  AREA
                </div>
              </div>

              {/* Building Row 1 */}
              <div className="grid grid-cols-4 gap-4 py-2">
                <div className="text-[#2d3338] text-[14px] font-normal leading-[20px]">
                  55 Arch Street
                </div>
                <div className="text-[#2d3338] text-[14px] font-normal leading-[20px]">
                  Floor 9, Floor 8
                </div>
                <div className="text-[#2d3338] text-[14px] font-normal leading-[20px]">
                  Suite 901, Suite 801
                </div>
                <div className="text-[#2d3338] text-[14px] font-normal leading-[20px]">
                  15,000 sq ft
                </div>
              </div>

              {/* Building Row 2 */}
              <div className="grid grid-cols-4 gap-4 py-2">
                <div className="text-[#2d3338] text-[14px] font-normal leading-[20px]">
                  100 Summer Street
                </div>
                <div className="text-[#2d3338] text-[14px] font-normal leading-[20px]">
                  Floor 12
                </div>
                <div className="text-[#2d3338] text-[14px] font-normal leading-[20px]">
                  Suite 1205
                </div>
                <div className="text-[#2d3338] text-[14px] font-normal leading-[20px]">
                  8,500 sq ft
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

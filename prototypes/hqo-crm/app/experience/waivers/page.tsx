"use client";

import { useState } from "react";
// Sidebar is provided by app/experience/layout.tsx
import { Card, CardContent } from "@/components/ui/card";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Download,
  ChevronDown,
  Calendar,
  FileText,
  MapPin,
  Users,
  X,
  Info,
  ScrollText,
  Shield,
  UserCheck,
  Building2,
  Dumbbell,
  PartyPopper,
} from "lucide-react";
import Link from "next/link";

const mockWaivers = [
  {
    id: "1",
    name: "Gym Access Waiver",
    description: "Liability waiver for gym and fitness facility access",
    type: "Fitness & Wellness",
    status: "active",
    signatureCount: 156,
    lastUpdated: "2 hours ago",
    attachedTo: [
      { type: "resource", name: "Fitness Center" },
      { type: "resource", name: "Yoga Studio" },
      { type: "event", name: "Personal Training" },
    ],
    totalAttached: 3,
    icon: Dumbbell,
  },
  {
    id: "2",
    name: "Event Participation Waiver",
    description:
      "General liability waiver for all building events and activities",
    type: "Events & Activities",
    status: "active",
    signatureCount: 89,
    lastUpdated: "1 day ago",
    attachedTo: [
      { type: "event", name: "Happy Hour" },
      { type: "event", name: "Rooftop Party" },
      { type: "event", name: "Networking Event" },
      { type: "event", name: "Game Night" },
    ],
    totalAttached: 4,
    icon: PartyPopper,
  },
  {
    id: "3",
    name: "Rooftop Access Agreement",
    description: "Safety and liability waiver for rooftop terrace access",
    type: "Facility Access",
    status: "active",
    signatureCount: 234,
    lastUpdated: "3 days ago",
    attachedTo: [
      { type: "resource", name: "Rooftop Terrace" },
      { type: "event", name: "Rooftop Events" },
    ],
    totalAttached: 2,
    icon: Building2,
  },
  {
    id: "4",
    name: "Photography Release",
    description: "Media release for photography and videography at events",
    type: "Media & Marketing",
    status: "draft",
    signatureCount: 0,
    lastUpdated: "1 week ago",
    attachedTo: [],
    totalAttached: 0,
    icon: FileText,
  },
  {
    id: "5",
    name: "Equipment Rental Waiver",
    description:
      "Liability waiver for borrowing building equipment and resources",
    type: "Equipment & Resources",
    status: "active",
    signatureCount: 67,
    lastUpdated: "5 days ago",
    attachedTo: [
      { type: "resource", name: "Conference Room AV" },
      { type: "resource", name: "Kitchen Equipment" },
      { type: "resource", name: "Recreation Equipment" },
    ],
    totalAttached: 3,
    icon: Shield,
  },
  {
    id: "6",
    name: "Visitor Access Waiver",
    description: "Liability waiver for tenant guests and visitors",
    type: "Guest & Visitor",
    status: "active",
    signatureCount: 445,
    lastUpdated: "12 hours ago",
    attachedTo: [{ type: "content", name: "Visitor Guidelines" }],
    totalAttached: 1,
    icon: UserCheck,
  },
];

const waiverTemplates = [
  {
    id: "gym-template",
    name: "Fitness Center Waiver",
    description:
      "Comprehensive liability waiver for gym and fitness facility usage including equipment, classes, and personal training sessions.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    icon: Dumbbell,
    type: "Fitness & Wellness",
    tags: ["Popular", "Featured", "Required"],
    sections: [
      {
        name: "Assumption of Risk",
        description: "Acknowledgment of inherent fitness risks",
      },
      {
        name: "Release of Claims",
        description: "Waiver of liability for injuries",
      },
      {
        name: "Medical Clearance",
        description: "Confirmation of fitness to participate",
      },
      {
        name: "Equipment Usage",
        description: "Agreement to use equipment safely",
      },
    ],
  },
  {
    id: "event-template",
    name: "Event Participation Waiver",
    description:
      "General liability waiver for building events, social activities, and group gatherings with customizable event-specific terms.",
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop",
    icon: PartyPopper,
    type: "Events & Activities",
    tags: ["Popular", "Versatile", "Standard"],
    sections: [
      {
        name: "Event Participation",
        description: "Agreement to participate at own risk",
      },
      {
        name: "Behavioral Standards",
        description: "Code of conduct for events",
      },
      {
        name: "Photography Consent",
        description: "Permission for event photography",
      },
      {
        name: "Alcohol Policy",
        description: "Acknowledgment of alcohol policies",
      },
    ],
  },
  {
    id: "facility-template",
    name: "Facility Access Waiver",
    description:
      "Safety and liability waiver for accessing restricted or specialized building areas like rooftops, storage, and mechanical spaces.",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    icon: Building2,
    type: "Facility Access",
    tags: ["Security", "Safety"],
    sections: [
      {
        name: "Access Authorization",
        description: "Permission to access restricted areas",
      },
      {
        name: "Safety Protocols",
        description: "Agreement to follow safety procedures",
      },
      {
        name: "Emergency Procedures",
        description: "Understanding of emergency protocols",
      },
      {
        name: "Property Responsibility",
        description: "Accountability for property damage",
      },
    ],
  },
  {
    id: "media-template",
    name: "Media Release & Photography Waiver",
    description:
      "Comprehensive media release for photography, videography, and promotional materials with detailed rights and usage terms.",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop",
    icon: FileText,
    type: "Media & Marketing",
    tags: ["Legal", "Marketing"],
    sections: [
      {
        name: "Image Rights",
        description: "Permission to use likeness in media",
      },
      { name: "Usage Terms", description: "Scope of media usage rights" },
      {
        name: "Distribution Rights",
        description: "Permission for content distribution",
      },
      {
        name: "Revocation Terms",
        description: "Conditions for withdrawing consent",
      },
    ],
  },
  {
    id: "equipment-template",
    name: "Equipment & Resource Waiver",
    description:
      "Liability waiver for borrowing, using, or renting building equipment, tools, and shared resources with damage accountability.",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    icon: Shield,
    type: "Equipment & Resources",
    tags: ["Property", "Responsibility"],
    sections: [
      {
        name: "Equipment Condition",
        description: "Acknowledgment of equipment state",
      },
      {
        name: "Proper Usage",
        description: "Agreement to use equipment correctly",
      },
      { name: "Damage Liability", description: "Responsibility for damages" },
      { name: "Return Policy", description: "Terms for equipment return" },
    ],
  },
  {
    id: "visitor-template",
    name: "Guest & Visitor Waiver",
    description:
      "Liability and security waiver for tenant guests, visitors, and temporary building access with identification requirements.",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    icon: UserCheck,
    type: "Guest & Visitor",
    tags: ["Security", "Access Control"],
    sections: [
      {
        name: "Visitor Identification",
        description: "Required identification and registration",
      },
      {
        name: "Sponsored Access",
        description: "Tenant responsibility for guests",
      },
      {
        name: "Building Rules",
        description: "Agreement to follow building policies",
      },
      {
        name: "Emergency Contact",
        description: "Provision of emergency information",
      },
    ],
  },
];

export default function WaiversPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  const filteredWaivers = mockWaivers.filter((waiver) => {
    const matchesSearch =
      waiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      waiver.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      waiver.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || waiver.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-green-100 text-green-800">• Active</Badge>;
    }

    if (status === "draft") {
      return <Badge className="bg-gray-100 text-gray-800">• Draft</Badge>;
    }

    return <Badge className="bg-blue-100 text-blue-800">• {status}</Badge>;
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-4 w-4" />;
      case "resource":
        return <MapPin className="h-4 w-4" />;
      case "content":
        return <FileText className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      case "service":
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const renderWaiverAttachments = (
    attachedTo: any[],
    totalAttached: number
  ) => {
    const displayItems = attachedTo.slice(0, 3);
    const remaining = totalAttached - 3;

    const getItemIcon = (type: string) => {
      switch (type) {
        case "event":
          return <Calendar className="h-3 w-3" />;
        case "resource":
          return <MapPin className="h-3 w-3" />;
        case "content":
          return <FileText className="h-3 w-3" />;
        case "document":
          return <FileText className="h-3 w-3" />;
        default:
          return <FileText className="h-3 w-3" />;
      }
    };

    if (totalAttached === 0) {
      return <div className="text-gray-400 text-sm">No attachments</div>;
    }

    return (
      <div className="flex items-center -space-x-1">
        {displayItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 border border-white text-gray-600"
            title={`${item.type}: ${item.name}`}
          >
            {getItemIcon(item.type)}
          </div>
        ))}
        {remaining > 0 && (
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 border border-white text-xs font-medium text-gray-600">
            +{remaining}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Waivers</h1>
          <div className="flex items-center space-x-3">
            <Dialog open={isTemplatesOpen} onOpenChange={setIsTemplatesOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Browse templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    Waiver Templates
                  </DialogTitle>
                  <p className="text-muted-foreground">
                    Choose from pre-built waiver templates to get started
                    quickly
                  </p>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-8 mt-8">
                  {waiverTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="group bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-gray-300 hover:shadow-sm"
                    >
                      <div className="flex h-72">
                        {/* Image Section */}
                        <div className="w-1/3 relative bg-gradient-to-br from-gray-50 to-gray-100">
                          <img
                            src={template.image}
                            alt={template.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Content Section */}
                        <div className="w-2/3 p-6 flex flex-col">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 pr-4">
                              <h3 className="font-semibold text-xl text-gray-900 mb-2">
                                {template.name}
                              </h3>
                              <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                {template.description}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {template.tags.slice(0, 3).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap"
                              onClick={() => {
                                const params = new URLSearchParams({
                                  template: template.id,
                                  name: template.name,
                                  type: template.type,
                                  description: template.description,
                                  icon: template.icon.name,
                                  tags: template.tags.join(","),
                                  sections: JSON.stringify(template.sections),
                                });
                                window.location.href = `/experience/waivers/create?${params.toString()}`;
                              }}
                            >
                              Create waiver
                            </Button>
                          </div>

                          {/* Content Sections Grid */}
                          <div className="flex-1 mt-2">
                            <div className="flex flex-wrap gap-2">
                              {template.sections
                                .slice(0, 3)
                                .map((section, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2 px-3 py-2 bg-gray-50/70 rounded-lg border border-gray-100 flex-shrink-0"
                                  >
                                    <div className="flex items-center justify-center h-4 w-4 rounded bg-white shadow-sm">
                                      <ScrollText className="h-3 w-3" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <p className="font-medium text-xs text-gray-900 truncate max-w-24">
                                        {section.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Section
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              {template.sections.length > 3 && (
                                <div className="flex items-center justify-center px-3 py-2 bg-gray-50/70 rounded-lg border border-gray-100 flex-shrink-0">
                                  <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                                    +{template.sections.length - 3} more
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              asChild
            >
              <Link href="/experience/waivers/create">Create waiver</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Description Banner */}
      <div className="mx-6">
        <AlertBanner
          title="About Waivers"
          description="Waivers help protect your organization by having tenants acknowledge risks and waive liability for various activities, facilities, and events. Attach them to resources, events, or content to require signatures before access."
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 space-y-6">
          {/* Title and Filters on Background */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                All waivers ({filteredWaivers.length})
              </h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by waiver name"
                    className="pl-9 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Data Table with White Background */}
          <Card>
            <CardContent className="p-0">
              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="text-left font-medium text-gray-500">
                      Waiver
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-500">
                      Type
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-500">
                      <div className="flex items-center">
                        Signatures
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-500">
                      <div className="flex items-center">
                        Last updated
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-500">
                      Status
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-500">
                      <div className="flex items-center">
                        Attached to
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWaivers.map((waiver) => (
                    <TableRow
                      key={waiver.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        window.location.href = `/experience/waivers/${waiver.id}`;
                      }}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100">
                            <waiver.icon className="w-5 h-5 text-gray-700" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {waiver.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {waiver.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-gray-900">{waiver.type}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900 font-medium">
                            {waiver.signatureCount}
                          </span>
                          <span className="text-gray-500 text-sm">
                            signatures
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-gray-900">
                          {waiver.lastUpdated}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(waiver.status)}
                      </TableCell>
                      <TableCell className="py-4">
                        {renderWaiverAttachments(
                          waiver.attachedTo,
                          waiver.totalAttached
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

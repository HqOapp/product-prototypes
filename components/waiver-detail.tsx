"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Edit,
  Download,
  Share,
  Users,
  Calendar,
  FileText,
  MapPin,
  Settings,
  BarChart3,
  Search,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  ScrollText,
  Shield,
  UserCheck,
  Building2,
  Dumbbell,
  PartyPopper,
} from "lucide-react";
import Link from "next/link";
import { createHqoCrmRoute } from "@/lib/hqo-crm-routes";

const mockWaiverData = {
  "1": {
    id: "1",
    name: "Gym Access Waiver",
    description: "Liability waiver for gym and fitness facility access",
    type: "Fitness & Wellness",
    status: "active",
    signatureCount: 156,
    lastUpdated: "2 hours ago",
    createdDate: "2024-01-15",
    expirationDate: "2024-12-31",
    icon: Dumbbell,
    content: `
ASSUMPTION OF RISK AND WAIVER OF LIABILITY

By signing this waiver, I acknowledge and agree to the following:

1. ASSUMPTION OF RISK: I understand that physical exercise and the use of fitness equipment involve inherent risks of injury, including but not limited to muscle strains, sprains, broken bones, and in rare cases, more serious injuries.

2. WAIVER OF LIABILITY: I hereby waive, release, and discharge the building management, property owners, and their employees from any and all claims, demands, or causes of action arising from my use of the fitness facilities.

3. MEDICAL CLEARANCE: I represent that I am physically fit and have no medical condition that would prevent my safe participation in fitness activities.

4. EQUIPMENT USAGE: I agree to use all equipment properly and in accordance with posted instructions and safety guidelines.
    `,
    attachedTo: [
      { type: "resource", name: "Fitness Center", id: "fitness-center" },
      { type: "resource", name: "Yoga Studio", id: "yoga-studio" },
      { type: "event", name: "Personal Training", id: "personal-training" },
    ],
    signatures: [
      {
        id: "sig-1",
        tenantName: "Sarah Martinez",
        tenantCompany: "Tech Innovations Inc",
        signedDate: "2024-01-20T10:30:00Z",
        ipAddress: "192.168.1.100",
        status: "completed",
      },
      {
        id: "sig-2",
        tenantName: "Michael Chen",
        tenantCompany: "Design Studio LLC",
        signedDate: "2024-01-19T14:15:00Z",
        ipAddress: "192.168.1.101",
        status: "completed",
      },
      {
        id: "sig-3",
        tenantName: "Jennifer Davis",
        tenantCompany: "Marketing Solutions",
        signedDate: "2024-01-18T09:45:00Z",
        ipAddress: "192.168.1.102",
        status: "completed",
      },
      {
        id: "sig-4",
        tenantName: "Robert Johnson",
        tenantCompany: "Johnson & Associates",
        signedDate: "2024-01-17T16:20:00Z",
        ipAddress: "192.168.1.103",
        status: "completed",
      },
      {
        id: "sig-5",
        tenantName: "Emily Rodriguez",
        tenantCompany: "Creative Agency",
        signedDate: "2024-01-16T11:30:00Z",
        ipAddress: "192.168.1.104",
        status: "completed",
      },
    ],
  },
  "2": {
    id: "2",
    name: "Event Participation Waiver",
    description:
      "General liability waiver for all building events and activities",
    type: "Events & Activities",
    status: "active",
    signatureCount: 89,
    lastUpdated: "1 day ago",
    createdDate: "2024-01-10",
    expirationDate: "2024-12-31",
    icon: PartyPopper,
    content: `
EVENT PARTICIPATION WAIVER AND RELEASE

I acknowledge and agree to the following terms for participation in building events:

1. VOLUNTARY PARTICIPATION: My participation in events is entirely voluntary and at my own risk.

2. ASSUMPTION OF RISKS: I understand that events may involve risks including but not limited to slips, falls, food allergies, and interaction with other participants.

3. BEHAVIORAL STANDARDS: I agree to conduct myself in a respectful and appropriate manner during all events.

4. PHOTOGRAPHY CONSENT: I consent to being photographed or recorded during events for promotional purposes.

5. ALCOHOL POLICY: If alcohol is served, I agree to consume responsibly and acknowledge the building's alcohol policies.
    `,
    attachedTo: [
      { type: "event", name: "Happy Hour", id: "happy-hour" },
      { type: "event", name: "Rooftop Party", id: "rooftop-party" },
      { type: "event", name: "Networking Event", id: "networking-event" },
      { type: "event", name: "Game Night", id: "game-night" },
    ],
    signatures: [
      {
        id: "sig-6",
        tenantName: "David Wilson",
        tenantCompany: "Wilson Consulting",
        signedDate: "2024-01-19T18:00:00Z",
        ipAddress: "192.168.1.105",
        status: "completed",
      },
    ],
  },
};

const tabs = [
  { id: "overview", name: "Overview" },
  { id: "signatures", name: "Signatures" },
  { id: "attachments", name: "Attachments" },
  { id: "settings", name: "Settings" },
];

interface WaiverDetailProps {
  waiverId?: string;
}

export function WaiverDetail({ waiverId }: WaiverDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Get waiver data by ID from the mock data
  const waiverData = waiverId
    ? mockWaiverData[waiverId as keyof typeof mockWaiverData]
    : null;

  if (!waiverData) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-6">
          <div className="flex items-center space-x-4 mb-6">
            <Link href={createHqoCrmRoute("/experience/waivers")}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to waivers
              </Button>
            </Link>
          </div>
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Waiver not found
            </h2>
            <p className="text-gray-600">
              The waiver you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-green-100 text-green-800">• Active</Badge>;
    }

    if (status === "draft") {
      return <Badge className="bg-gray-100 text-gray-800">• Draft</Badge>;
    }

    return <Badge className="bg-blue-100 text-blue-800">• {status}</Badge>;
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-4 w-4" />;
      case "resource":
        return <MapPin className="h-4 w-4" />;
      case "content":
        return <FileText className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredSignatures =
    waiverData.signatures?.filter((signature) => {
      const matchesSearch =
        signature.tenantName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        signature.tenantCompany
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || signature.status === statusFilter;

      return matchesSearch && matchesStatus;
    }) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-6 border-b bg-white">
        <div className="flex items-center space-x-4 mb-6">
          <Link href={createHqoCrmRoute("/experience/waivers")}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to waivers
            </Button>
          </Link>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-blue-100">
              <waiverData.icon className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {waiverData.name}
              </h1>
              <p className="text-gray-600 mt-1">{waiverData.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                {getStatusBadge(waiverData.status)}
                <Badge variant="secondary">{waiverData.type}</Badge>
                <span className="text-sm text-gray-500">
                  {waiverData.signatureCount} signatures
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit waiver
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 bg-white border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-sm">
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {activeTab === "overview" && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Waiver Content */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ScrollText className="h-5 w-5 mr-2" />
                      Waiver Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                        {waiverData.content}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* Key Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Key Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Created
                      </label>
                      <p className="text-sm text-gray-900">
                        {new Date(waiverData.createdDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Last updated
                      </label>
                      <p className="text-sm text-gray-900">
                        {waiverData.lastUpdated}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Expiration date
                      </label>
                      <p className="text-sm text-gray-900">
                        {new Date(
                          waiverData.expirationDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Total signatures
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {waiverData.signatureCount}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Completion rate
                      </span>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Average time to sign
                      </span>
                      <span className="text-sm font-medium">2m 30s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Attachments</span>
                      <span className="text-sm font-medium">
                        {waiverData.attachedTo.length}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === "signatures" && (
          <div className="p-6 space-y-6">
            {/* Filters */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Signatures ({filteredSignatures.length})
              </h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by tenant name"
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
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export signatures
                </Button>
              </div>
            </div>

            {/* Signatures Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Signed date</TableHead>
                      <TableHead>IP address</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSignatures.map((signature) => (
                      <TableRow key={signature.id}>
                        <TableCell>
                          <div className="font-medium">
                            {signature.tenantName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-600">
                            {signature.tenantCompany}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-600">
                            {formatDate(signature.signedDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-600 font-mono text-sm">
                            {signature.ipAddress}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "attachments" && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Attachments ({waiverData.attachedTo.length})
              </h3>
              <Button size="sm">Attach to resource/event</Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {waiverData.attachedTo.map((attachment, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getAttachmentIcon(attachment.type)}
                            <span className="capitalize">
                              {attachment.type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{attachment.name}</div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-medium">Waiver Settings</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Waiver name</label>
                    <Input defaultValue={waiverData.name} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea defaultValue={waiverData.description} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <Select defaultValue={waiverData.type}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fitness & Wellness">
                          Fitness & Wellness
                        </SelectItem>
                        <SelectItem value="Events & Activities">
                          Events & Activities
                        </SelectItem>
                        <SelectItem value="Facility Access">
                          Facility Access
                        </SelectItem>
                        <SelectItem value="Media & Marketing">
                          Media & Marketing
                        </SelectItem>
                        <SelectItem value="Equipment & Resources">
                          Equipment & Resources
                        </SelectItem>
                        <SelectItem value="Guest & Visitor">
                          Guest & Visitor
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select defaultValue={waiverData.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Expiration date
                    </label>
                    <Input
                      type="date"
                      defaultValue={waiverData.expirationDate}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Require IP tracking
                    </span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Email confirmation
                    </span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Digital signature required
                    </span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save changes</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

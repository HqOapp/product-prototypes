import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Table imports - commented out for now, only using list view
/*
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
*/
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  ExternalLink,
  FileText,
  Building,
  Search,
  Phone,
  Mail,
  MoreVertical,
  // Grip, List, Table as TableIcon, // commented out - only for view picker
  User,
} from "lucide-react";
import { useState } from "react";

interface ContactsTabProps {
  selectedBuildings: string[];
  onOpenContactNotes: (contact: any) => void;
}

// Building data for assignments
const buildings = [
  {
    id: "cobblestone",
    name: "Cobblestone Collaborative",
    shortName: "CC",
    color: "bg-blue-100 text-blue-700",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop&crop=entropy&auto=format&q=80",
  },
  {
    id: "metro-tower",
    name: "Metro Tower",
    shortName: "MT",
    color: "bg-green-100 text-green-700",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=400&fit=crop&crop=entropy&auto=format&q=80",
  },
  {
    id: "innovation-hub",
    name: "Innovation Hub",
    shortName: "IH",
    color: "bg-purple-100 text-purple-700",
    image:
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=400&fit=crop&crop=entropy&auto=format&q=80",
  },
];

// Contact data with building assignments
const contacts = [
  {
    id: "1",
    name: "Alex Morgan",
    email: "amorgan@ecovoltenergy.com",
    title: "CEO",
    phone: "(555) 123-4567",
    avatar: "AM",
    avatarColor: "bg-gray-100 text-gray-700",
    buildingIds: ["cobblestone", "metro-tower", "innovation-hub"], // All 3 buildings
    description: "Primary contact for all buildings",
    lastContact: "2 days ago",
    notesCount: 0,
  },
  {
    id: "2",
    name: "Jordan Lee",
    email: "jlee@ecovoltenergy.com",
    title: "CFO",
    phone: "(555) 123-4568",
    avatar: "JL",
    avatarColor: "bg-gray-100 text-gray-700",
    buildingIds: ["metro-tower", "innovation-hub"], // 2 buildings
    description: "Lease contact for Metro Tower and Innovation Hub",
    lastContact: "1 week ago",
    notesCount: 3,
  },
  {
    id: "3",
    name: "Taylor Kim",
    email: "kim@ecovoltenergy.com",
    title: "Operations Manager",
    phone: "(555) 123-4569",
    avatar: "TK",
    avatarColor: "bg-gray-100 text-gray-700",
    buildingIds: ["cobblestone"], // 1 building
    description: "Facilities contact for Cobblestone Collaborative",
    lastContact: "3 days ago",
    notesCount: 1,
  },
  {
    id: "4",
    name: "Sarah Martinez",
    email: "smartinez@ecovoltenergy.com",
    title: "Head of Engineering",
    phone: "(555) 123-4570",
    avatar: "SM",
    avatarColor: "bg-gray-100 text-gray-700",
    buildingIds: ["metro-tower"], // 1 building
    description: "Technical contact for Metro Tower",
    lastContact: "1 day ago",
    notesCount: 0,
  },
  {
    id: "5",
    name: "Michael Chen",
    email: "mchen@ecovoltenergy.com",
    title: "Business Development",
    phone: "(555) 123-4571",
    avatar: "MC",
    avatarColor: "bg-gray-100 text-gray-700",
    buildingIds: [], // No building assignments
    description: "Remote employee - no building access",
    lastContact: "5 days ago",
    notesCount: 0,
  },
];

export function ContactsTab({
  selectedBuildings,
  onOpenContactNotes,
}: ContactsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  // ViewMode state - commented out for now, keeping only list view
  // type ViewMode = "list" | "table" | "grid";
  // const [viewMode, setViewMode] = useState<ViewMode>("list");

  const getBuildingAssignments = (buildingIds: string[]) => {
    return buildingIds
      .map((id) => buildings.find((b) => b.id === id))
      .filter(
        (building): building is NonNullable<typeof building> =>
          building !== undefined
      );
  };

  // Filter contacts based on search
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="p-6">
      {/* Header with Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-3 ml-4">
            {/* View Mode Toggle - Hidden for now, keeping list view only */}
          </div>
        </div>
      </div>

      {/* Content Area - List View Only */}
      <div className="space-y-4">
          {filteredContacts.map((contact) => {
            const assignedBuildings = getBuildingAssignments(
              contact.buildingIds
            );

            return (
              <div key={contact.id} className="bg-white border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12 border border-gray-200">
                      <AvatarImage
                        src={`/api/placeholder/48/48`}
                        alt={contact.name}
                      />
                      <AvatarFallback className={contact.avatarColor}>
                        {contact.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {contact.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{contact.title}</span>
                          <span>•</span>
                          <span className="truncate">{contact.email}</span>
                          <span>•</span>
                          <span>{contact.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-1.5 mb-3 mt-0.5">
                        <div className="flex items-center space-x-2">
                          {assignedBuildings.map((building) => (
                            <div
                              key={building.id}
                              className="flex items-center space-x-1.5 bg-gray-100 border border-gray-300 rounded-full pl-0.5 pr-2 py-0.5"
                            >
                              <Avatar className="h-5 w-5 border border-gray-200">
                                <AvatarImage
                                  src={building.image}
                                  alt={building.name}
                                />
                                <AvatarFallback className={building.color}>
                                  {building.shortName}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-600">
                                {building.name}
                              </span>
                            </div>
                          ))}
                          {assignedBuildings.length === 0 && (
                            <span className="text-sm text-gray-400">
                              No building assignments
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <div className="flex items-center space-x-1">
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
                              onClick={() => onOpenContactNotes(contact)}
                            >
                              <FileText className="h-4 w-4" />
                              {contact.notesCount > 0 && (
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center min-w-[20px] bg-blue-600 text-white hover:bg-blue-700">
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
                    <div className="text-xs text-gray-500 text-right">
                      Last activity: {contact.lastContact}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Table View - Hidden for now */}
      {/* 
      {viewMode === "table" && (
        <div className="border rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Buildings</TableHead>
                <TableHead>Last activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => {
                const assignedBuildings = getBuildingAssignments(
                  contact.buildingIds
                );

                return (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 border border-gray-200">
                          <AvatarFallback className={contact.avatarColor}>
                            {contact.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-gray-500">
                            {contact.title}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{contact.email}</div>
                        <div className="text-sm text-gray-500">
                          {contact.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {assignedBuildings.map((building) => (
                          <div
                            key={building.id}
                            className="flex items-center space-x-1 bg-gray-100 border border-gray-300 rounded-full pl-1 pr-2 py-1"
                          >
                            <Avatar className="h-5 w-5 border border-gray-200">
                              <AvatarImage
                                src={building.image}
                                alt={building.name}
                              />
                              <AvatarFallback className={building.color}>
                                {building.shortName}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-600">
                              {building.name}
                            </span>
                          </div>
                        ))}
                        {assignedBuildings.length === 0 && (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {contact.lastContact}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 justify-end">
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
                                onClick={() => onOpenContactNotes(contact)}
                              >
                                <FileText className="h-4 w-4" />
                                {contact.notesCount > 0 && (
                                  <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center min-w-[20px] bg-blue-600 text-white hover:bg-blue-700">
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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
      */

      {/* Grid View - Hidden for now */}
      {/* 
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => {
            const assignedBuildings = getBuildingAssignments(
              contact.buildingIds
            );

            return (
              <div key={contact.id} className="bg-white border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border border-gray-200">
                      <AvatarImage
                        src={`/api/placeholder/40/40`}
                        alt={contact.name}
                      />
                      <AvatarFallback className={contact.avatarColor}>
                        {contact.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {contact.name}
                      </h3>
                      <p className="text-sm text-gray-500">{contact.title}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">{contact.email}</p>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  <div className="text-sm text-gray-600 mb-1.5">Buildings</div>
                  <div className="flex items-center space-x-2 flex-wrap gap-1">
                    {assignedBuildings.map((building) => (
                      <div
                        key={building.id}
                        className="flex items-center space-x-1 bg-gray-100 border border-gray-300 rounded-full pl-1 pr-2 py-1"
                      >
                        <Avatar className="h-4 w-4 border border-gray-200">
                          <AvatarImage
                            src={building.image}
                            alt={building.name}
                          />
                          <AvatarFallback className={building.color}>
                            {building.shortName}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-600">
                          {building.name}
                        </span>
                      </div>
                    ))}
                    {assignedBuildings.length === 0 && (
                      <span className="text-sm text-gray-400">
                        No assignments
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  <span className="font-medium">Last activity:</span>{" "}
                  {contact.lastContact}
                </div>

                <div className="flex items-center space-x-1 justify-center">
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
                          onClick={() => onOpenContactNotes(contact)}
                        >
                          <FileText className="h-4 w-4" />
                          {contact.notesCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center min-w-[20px] bg-blue-600 text-white hover:bg-blue-700">
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
            );
          })}
        </div>
      )}
      */

      {/* Empty State */}
      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No contacts found</p>
          <p className="text-sm text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}

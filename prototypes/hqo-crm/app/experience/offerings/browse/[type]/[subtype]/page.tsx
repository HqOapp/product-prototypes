"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Grid3X3,
  List,
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Calendar,
  Star,
  Building2,
} from "lucide-react";
import Link from "next/link";

// Mock data for individual offerings
const mockOfferings: Record<string, any[]> = {
  // Space offerings
  "space-meetings": [
    {
      id: "meeting-room-a1",
      name: "Conference Room A1",
      building: "Building A",
      floor: "1st Floor",
      capacity: 8,
      features: ["Video Conferencing", "Whiteboard", "Coffee Station"],
      price: "$45/hr",
      utilization: "68%",
      rating: 4.5,
      status: "Available",
      image: "/placeholder.jpg",
    },
    {
      id: "meeting-room-a2",
      name: "Conference Room A2",
      building: "Building A",
      floor: "2nd Floor",
      capacity: 12,
      features: ["Video Conferencing", "Presentation Screen", "Natural Light"],
      price: "$55/hr",
      utilization: "72%",
      rating: 4.7,
      status: "Available",
      image: "/placeholder.jpg",
    },
    {
      id: "meeting-room-b1",
      name: "Executive Boardroom",
      building: "Building B",
      floor: "10th Floor",
      capacity: 16,
      features: ["Premium AV", "City Views", "Catering Ready"],
      price: "$85/hr",
      utilization: "45%",
      rating: 4.9,
      status: "Available",
      image: "/placeholder.jpg",
    },
  ],
  "space-collaboration": [
    {
      id: "collab-space-1",
      name: "Innovation Hub",
      building: "Building A",
      floor: "3rd Floor",
      capacity: 20,
      features: ["Flexible Furniture", "Digital Walls", "Brainstorming Tools"],
      price: "$70/hr",
      utilization: "82%",
      rating: 4.6,
      status: "Available",
      image: "/placeholder.jpg",
    },
    {
      id: "collab-space-2",
      name: "Team Workshop Area",
      building: "Building A",
      floor: "4th Floor",
      capacity: 15,
      features: ["Moveable Desks", "Whiteboards", "Breakout Pods"],
      price: "$60/hr",
      utilization: "75%",
      rating: 4.4,
      status: "Available",
      image: "/placeholder.jpg",
    },
  ],
  // Service offerings
  "service-technology-support": [
    {
      id: "tech-support-1",
      name: "IT Help Desk",
      provider: "TechCorp Solutions",
      availability: "24/7",
      responseTime: "< 15 minutes",
      specialties: [
        "Hardware Setup",
        "Software Installation",
        "Network Issues",
      ],
      price: "$150/job",
      rating: 4.3,
      status: "Active",
      lastUsed: "2 hours ago",
    },
    {
      id: "tech-support-2",
      name: "AV Support Team",
      provider: "MediaTech Services",
      availability: "Business Hours",
      responseTime: "< 30 minutes",
      specialties: [
        "Presentation Setup",
        "Video Conferencing",
        "Audio Systems",
      ],
      price: "$100/hr",
      rating: 4.7,
      status: "Active",
      lastUsed: "1 day ago",
    },
  ],
  "service-hospitality-services": [
    {
      id: "hospitality-1",
      name: "Guest Relations",
      provider: "Concierge Plus",
      availability: "Business Hours",
      responseTime: "Immediate",
      specialties: [
        "Guest Check-in",
        "Tour Coordination",
        "Information Services",
      ],
      price: "$50/hr",
      rating: 4.8,
      status: "Active",
      lastUsed: "30 minutes ago",
    },
  ],
};

const subtypeDisplayNames: Record<string, string> = {
  // Space
  meetings: "Meeting Spaces",
  collaboration: "Collaboration Spaces",
  focus: "Focus Areas",
  "social-lounge": "Social & Lounge Areas",
  "food-beverage": "Food & Beverage Spaces",
  "event-hosting": "Event & Hosting Venues",
  outdoor: "Outdoor Spaces",
  showrooms: "Showrooms",
  "lab-rd": "Lab & R&D Facilities",
  "studios-creative": "Studios & Creative Spaces",
  "manufacturing-light-industrial": "Manufacturing & Light Industrial",
  "hybrid-work-zones": "Hybrid Work Zones",
  "reception-arrival": "Reception & Arrival Areas",

  // Service
  "technology-support": "Technology Support",
  "hospitality-services": "Hospitality Services",
  "experience-programming": "Experience Programming",
  communications: "Communications",
  "security-access": "Security & Access",
  "maintenance-ops": "Maintenance & Operations",
  "amenity-management": "Amenity Management",
  "food-beverage": "Food & Beverage Services",
  transportation: "Transportation",
  "feedback-support": "Feedback & Support",
  "move-in-onboarding": "Move-in/Onboarding",
  sustainability: "Sustainability",

  // Event / Program
  "one-time-event": "One-time Events",
  "recurring-program": "Recurring Programs",
  "workshop-training": "Workshops & Training",
  "fitness-class": "Fitness Classes",
  "networking-event": "Networking Events",
  "seasonal-activation": "Seasonal Activations",
};

export default function SubtypeListingPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string;
  const subtype = params.subtype as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");

  const subtypeKey = `${type}-${subtype}`;
  const offerings = mockOfferings[subtypeKey] || [];
  const displayName = subtypeDisplayNames[subtype] || subtype;

  const filteredOfferings = offerings.filter(
    (offering) =>
      offering.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (offering.building &&
        offering.building.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (offering.provider &&
        offering.provider.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderSpaceCard = (offering: any) => (
    <Card
      key={offering.id}
      className="cursor-pointer hover:shadow-md transition-shadow"
    >
      <Link
        href={`/experience/offerings/browse/${type}/${subtype}/${offering.id}`}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {offering.name}
              </h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Building2 className="h-4 w-4 mr-1" />
                {offering.building} • {offering.floor}
              </div>
            </div>
            <Badge
              variant={
                offering.status === "Available" ? "default" : "secondary"
              }
              className="text-xs"
            >
              {offering.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              {offering.capacity} people
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="h-4 w-4 mr-2" />
              {offering.rating} rating
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">Features</div>
            <div className="flex flex-wrap gap-1">
              {offering.features
                .slice(0, 3)
                .map((feature: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              {offering.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{offering.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-blue-600">
              {offering.price}
            </div>
            <div className="text-sm text-gray-500">
              {offering.utilization} utilization
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );

  const renderServiceCard = (offering: any) => (
    <Card
      key={offering.id}
      className="cursor-pointer hover:shadow-md transition-shadow"
    >
      <Link
        href={`/experience/offerings/browse/${type}/${subtype}/${offering.id}`}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {offering.name}
              </h3>
              <div className="text-sm text-gray-600 mb-2">
                {offering.provider}
              </div>
            </div>
            <Badge
              variant={offering.status === "Active" ? "default" : "secondary"}
              className="text-xs"
            >
              {offering.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              {offering.availability}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="h-4 w-4 mr-2" />
              {offering.rating} rating
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">Specialties</div>
            <div className="flex flex-wrap gap-1">
              {offering.specialties
                .slice(0, 3)
                .map((specialty: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              {offering.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{offering.specialties.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-blue-600">
              {offering.price}
            </div>
            <div className="text-sm text-gray-500">
              Last used: {offering.lastUsed}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );

  const renderTableView = () => (
    <div className="bg-white border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {type === "space" ? (
              <>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Features</TableHead>
              </>
            ) : (
              <>
                <TableHead>Provider</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Specialties</TableHead>
              </>
            )}
            <TableHead>Price</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOfferings.map((offering) => (
            <TableRow
              key={offering.id}
              className="cursor-pointer hover:bg-gray-50"
            >
              <TableCell>
                <Link
                  href={`/experience/offerings/browse/${type}/${subtype}/${offering.id}`}
                  className="font-medium hover:text-blue-600"
                >
                  {offering.name}
                </Link>
              </TableCell>
              {type === "space" ? (
                <>
                  <TableCell>
                    {offering.building} • {offering.floor}
                  </TableCell>
                  <TableCell>{offering.capacity} people</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {offering.features
                        .slice(0, 2)
                        .map((feature: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                      {offering.features.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{offering.features.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{offering.provider}</TableCell>
                  <TableCell>{offering.availability}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {offering.specialties
                        .slice(0, 2)
                        .map((specialty: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      {offering.specialties.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{offering.specialties.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                </>
              )}
              <TableCell className="font-semibold text-blue-600">
                {offering.price}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  {offering.rating}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    offering.status === "Available" ||
                    offering.status === "Active"
                      ? "default"
                      : "secondary"
                  }
                >
                  {offering.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-6 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {displayName}
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredOfferings.length}{" "}
              {type === "space" ? "spaces" : "services"} available
            </p>
          </div>
        </div>

        {/* Search and View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={`Search ${displayName.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="h-8 w-8 p-0 rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0 rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOfferings.map((offering) =>
                type === "space"
                  ? renderSpaceCard(offering)
                  : renderServiceCard(offering)
              )}
            </div>
          ) : (
            renderTableView()
          )}

          {filteredOfferings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">
                No {displayName.toLowerCase()} found
              </div>
              <p className="text-gray-400">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

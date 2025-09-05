"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Calendar,
  Star,
  Building2,
  Phone,
  Mail,
  Edit,
  Settings,
  BarChart3,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";

// Mock data for individual offerings
const mockOfferingDetails: Record<string, any> = {
  "meeting-room-a1": {
    id: "meeting-room-a1",
    name: "Conference Room A1",
    type: "space",
    subtype: "meetings",
    building: "Building A",
    floor: "1st Floor",
    room: "101A",
    capacity: 8,
    area: "220 sq ft",
    features: ["Video Conferencing", "Whiteboard", "Coffee Station", "Natural Light", "Climate Control"],
    price: "$45/hr",
    utilization: "68%",
    rating: 4.5,
    reviews: 24,
    status: "Available",
    description: "A modern conference room perfect for team meetings and client presentations. Features state-of-the-art video conferencing technology and comfortable seating for up to 8 people.",
    amenities: ["High-speed WiFi", "Power outlets", "HDMI connectivity", "Flip chart", "Water station"],
    bookingOptions: ["Hourly", "Half-day", "Full-day"],
    availability: {
      today: ["9:00 AM - 11:00 AM", "2:00 PM - 5:00 PM"],
      tomorrow: ["10:00 AM - 12:00 PM", "3:00 PM - 6:00 PM"]
    },
    recentBookings: [
      { date: "Today", time: "11:00 AM - 12:00 PM", bookedBy: "Sarah Johnson", purpose: "Team Standup" },
      { date: "Yesterday", time: "2:00 PM - 4:00 PM", bookedBy: "Mike Chen", purpose: "Client Presentation" },
      { date: "Dec 20", time: "9:00 AM - 11:00 AM", bookedBy: "Lisa Park", purpose: "Strategy Meeting" }
    ],
    contactInfo: {
      manager: "Facilities Team",
      phone: "+1 (555) 123-4567",
      email: "facilities@company.com"
    },
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"]
  },
  "tech-support-1": {
    id: "tech-support-1", 
    name: "IT Help Desk",
    type: "service",
    subtype: "technology-support",
    provider: "TechCorp Solutions",
    availability: "24/7",
    responseTime: "< 15 minutes",
    specialties: ["Hardware Setup", "Software Installation", "Network Issues", "Troubleshooting", "System Maintenance"],
    price: "$150/job",
    rating: 4.3,
    reviews: 156,
    status: "Active",
    description: "Comprehensive IT support services available 24/7 to keep your technology running smoothly. Our certified technicians provide rapid response for all your technical needs.",
    serviceLevel: "Premium",
    coverage: ["Desktop Support", "Network Administration", "Security Management", "Cloud Services"],
    lastUsed: "2 hours ago",
    recentRequests: [
      { date: "Today", time: "2:00 PM", requestedBy: "John Smith", issue: "Laptop won't connect to WiFi", status: "Resolved" },
      { date: "Today", time: "10:30 AM", requestedBy: "Anna Wilson", issue: "Software installation", status: "In Progress" },
      { date: "Yesterday", time: "4:15 PM", requestedBy: "Robert Davis", issue: "Password reset", status: "Resolved" }
    ],
    contactInfo: {
      manager: "David Rodriguez",
      phone: "+1 (555) 987-6543", 
      email: "support@techcorp.com"
    },
    metrics: {
      totalRequests: 2847,
      avgResolutionTime: "12 minutes",
      satisfactionScore: "94%",
      uptime: "99.8%"
    }
  }
};

export default function OfferingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string;
  const subtype = params.subtype as string;
  const id = params.id as string;
  
  const offering = mockOfferingDetails[id];
  
  if (!offering) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Offering not found</h2>
          <p className="text-gray-600 mb-4">The offering you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isSpace = offering.type === "space";

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
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
              <h1 className="text-2xl font-semibold text-gray-900">{offering.name}</h1>
              <p className="text-gray-600 mt-1">
                {isSpace ? `${offering.building} • ${offering.floor}` : offering.provider}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Overview</span>
                  <Badge variant={offering.status === "Available" || offering.status === "Active" ? "default" : "secondary"}>
                    {offering.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">{offering.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {isSpace ? (
                    <>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Users className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                        <div className="text-sm font-medium">{offering.capacity}</div>
                        <div className="text-xs text-gray-500">Capacity</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Building2 className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                        <div className="text-sm font-medium">{offering.area}</div>
                        <div className="text-xs text-gray-500">Area</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Clock className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                        <div className="text-sm font-medium">{offering.availability}</div>
                        <div className="text-xs text-gray-500">Availability</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <BarChart3 className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                        <div className="text-sm font-medium">{offering.responseTime}</div>
                        <div className="text-xs text-gray-500">Response Time</div>
                      </div>
                    </>
                  )}
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Star className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                    <div className="text-sm font-medium">{offering.rating}</div>
                    <div className="text-xs text-gray-500">{offering.reviews} reviews</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{offering.price}</div>
                    <div className="text-xs text-gray-500">Price</div>
                  </div>
                </div>

                {/* Features/Specialties */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    {isSpace ? "Features" : "Specialties"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(isSpace ? offering.features : offering.specialties).map((item: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Additional amenities for spaces or coverage for services */}
                {isSpace && offering.amenities && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {offering.amenities.map((amenity: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {!isSpace && offering.coverage && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Service Coverage</h4>
                    <div className="flex flex-wrap gap-2">
                      {offering.coverage.map((area: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {isSpace ? "Recent Bookings" : "Recent Requests"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(isSpace ? offering.recentBookings : offering.recentRequests).map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          {isSpace ? item.bookedBy : item.requestedBy}
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.date} • {item.time}
                        </div>
                        <div className="text-sm text-gray-500">
                          {isSpace ? item.purpose : item.issue}
                        </div>
                      </div>
                      {!isSpace && (
                        <Badge variant={item.status === "Resolved" ? "default" : "secondary"}>
                          {item.status}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service Metrics (for services only) */}
            {!isSpace && offering.metrics && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{offering.metrics.totalRequests}</div>
                      <div className="text-xs text-gray-500">Total Requests</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{offering.metrics.avgResolutionTime}</div>
                      <div className="text-xs text-gray-500">Avg Resolution</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{offering.metrics.satisfactionScore}</div>
                      <div className="text-xs text-gray-500">Satisfaction</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{offering.metrics.uptime}</div>
                      <div className="text-xs text-gray-500">Uptime</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    {isSpace ? "Book Now" : "Request Service"}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Star className="h-4 w-4 mr-2" />
                    Leave Review
                  </Button>
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Availability (for spaces) */}
            {isSpace && offering.availability && (
              <Card>
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="font-medium text-gray-900 mb-2">Today</div>
                      {offering.availability.today.map((slot: string, index: number) => (
                        <div key={index} className="text-sm text-green-600 mb-1">
                          ✓ {slot}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 mb-2">Tomorrow</div>
                      {offering.availability.tomorrow.map((slot: string, index: number) => (
                        <div key={index} className="text-sm text-green-600 mb-1">
                          ✓ {slot}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-gray-900">{offering.contactInfo.manager}</div>
                    <div className="text-sm text-gray-600">Manager</div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {offering.contactInfo.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {offering.contactInfo.email}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location (for spaces) */}
            {isSpace && (
              <Card>
                <CardHeader>
                  <CardTitle>Location Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{offering.building}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{offering.floor}, Room {offering.room}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

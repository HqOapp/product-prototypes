"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Grid3X3,
  Table as TableIcon,
  Building2,
  Settings,
  CalendarDays,
  Wrench,
} from "lucide-react";
import Link from "next/link";

const subtypes = [
  {
    id: "meetings",
    name: "Meetings",
    type: "Space",
    stats: { total: 12, active: 10, utilization: "68%", avgPrice: "$45/hr" },
  },
  {
    id: "collaboration",
    name: "Collaboration",
    type: "Space",
    stats: { total: 6, active: 6, utilization: "72%", avgPrice: "$70/hr" },
  },
  {
    id: "focus",
    name: "Focus",
    type: "Space",
    stats: { total: 15, active: 12, utilization: "81%", avgPrice: "$50/hr" },
  },
  {
    id: "event-hosting",
    name: "Event / Hosting",
    type: "Space",
    stats: { total: 2, active: 2, utilization: "34%", avgPrice: "$2,000" },
  },
  {
    id: "lab-rd",
    name: "Lab / R&D",
    type: "Space",
    stats: { total: 3, active: 3, utilization: "41%", avgPrice: "$400/day" },
  },
  {
    id: "studios-creative",
    name: "Studios / Creative",
    type: "Space",
    stats: { total: 1, active: 1, utilization: "60%", avgPrice: "$60/hr" },
  },
  {
    id: "food-beverage",
    name: "Food & Beverage",
    type: "Space",
    stats: { total: 1, active: 1, utilization: "28%", avgPrice: "$100/hr" },
  },
  {
    id: "showrooms",
    name: "Showrooms",
    type: "Space",
    stats: { total: 5, active: 4, utilization: "79%", avgPrice: "$500/day" },
  },
  {
    id: "hybrid-work-zones",
    name: "Hybrid Work Zones",
    type: "Space",
    stats: { total: 100, active: 95, utilization: "55%", avgPrice: "$15/day" },
  },
  {
    id: "food-beverage",
    name: "Food & Beverage",
    type: "Service",
    stats: { total: 1, active: 1, utilization: "50%", avgPrice: "$25/person" },
  },
  {
    id: "hospitality-services",
    name: "Hospitality Services",
    type: "Service",
    stats: { total: 1, active: 1, utilization: "30%", avgPrice: "$50/hr" },
  },
  {
    id: "maintenance-ops",
    name: "Maintenance & Ops",
    type: "Service",
    stats: { total: 3, active: 3, utilization: "70%", avgPrice: "$0.25/sq ft" },
  },
  {
    id: "technology-support",
    name: "Technology Support",
    type: "Service",
    stats: { total: 2, active: 2, utilization: "45%", avgPrice: "$150/job" },
  },
  {
    id: "experience-programming",
    name: "Experience Programming",
    type: "Service",
    stats: { total: 2, active: 2, utilization: "60%", avgPrice: "$100/hr" },
  },
  {
    id: "security-access",
    name: "Security & Access",
    type: "Service",
    stats: { total: 2, active: 2, utilization: "52%", avgPrice: "$75/hr" },
  },
  {
    id: "move-in-onboarding",
    name: "Move-in/Onboarding",
    type: "Service",
    stats: { total: 1, active: 1, utilization: "20%", avgPrice: "$600" },
  },
  {
    id: "sustainability",
    name: "Sustainability",
    type: "Service",
    stats: { total: 2, active: 2, utilization: "38%", avgPrice: "$80/hr" },
  },

  {
    id: "one-time-event",
    name: "One-time Event",
    type: "Event / Program",
    stats: { total: 3, active: 2, utilization: "--", avgPrice: "$20/ticket" },
  },
  {
    id: "recurring-program",
    name: "Recurring Program",
    type: "Event / Program",
    stats: { total: 4, active: 3, utilization: "--", avgPrice: "$10/session" },
  },
  {
    id: "workshop-training",
    name: "Workshop / Training Session",
    type: "Event / Program",
    stats: { total: 2, active: 2, utilization: "--", avgPrice: "$0" },
  },
  {
    id: "class-fitness-educational-hobby",
    name: "Class (Fitness / Educational / Hobby)",
    type: "Event / Program",
    stats: { total: 5, active: 5, utilization: "--", avgPrice: "$0" },
  },
  {
    id: "networking-event",
    name: "Networking Event",
    type: "Event / Program",
    stats: { total: 2, active: 2, utilization: "--", avgPrice: "$0" },
  },
  {
    id: "seasonal-activation",
    name: "Seasonal Activation / Holiday Event",
    type: "Event / Program",
    stats: { total: 1, active: 1, utilization: "--", avgPrice: "$0" },
  },
];

export default function OfferingsOverviewTwoPage() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "all",
  ]); // multi-select chips
  type ViewMode = "cards" | "table";
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  // Modal states
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [selectedSubtype, setSelectedSubtype] = useState("");
  const [onboardStep, setOnboardStep] = useState(1);
  const [selectedOnboardTypes, setSelectedOnboardTypes] = useState<string[]>(
    []
  );
  const [typeCounts, setTypeCounts] = useState<Record<string, number>>({});

  const categories = [
    { id: "all", name: "All" },
    {
      id: "Space",
      name: "Space",
      benefit:
        "Spaces drive bookings and foot traffic; more options increase utilization and tenant satisfaction.",
    },
    {
      id: "Service",
      name: "Service",
      benefit:
        "Services create ancillary revenue and improve tenant experience (e.g., cleaning, IT, catering).",
    },
    {
      id: "Event / Program",
      name: "Event / Program",
      benefit:
        "Events build community and support leasing with experiential touchpoints.",
    },
  ];

  const productTypes = [
    {
      id: "space",
      name: "Space",
      description:
        "A bookable room or area (e.g., conference room, event hall, lab).",
      icon: Building2,
      color: "bg-blue-50 border-blue-200 text-blue-900",
    },
    {
      id: "service",
      name: "Service",
      description:
        "A fulfillable service (e.g., catering, cleaning, IT setup, AV support).",
      icon: Settings,
      color: "bg-orange-50 border-orange-200 text-orange-900",
    },
    {
      id: "event-program",
      name: "Event / Program",
      description:
        "A scheduled session with registrations (e.g., yoga class, networking night).",
      icon: CalendarDays,
      color: "bg-purple-50 border-purple-200 text-purple-900",
    },
    {
      id: "other",
      name: "Other",
      description: "Offerings that don't fit into standard categories",
      icon: Wrench,
      color: "bg-gray-50 border-gray-200 text-gray-900",
    },
  ];

  const subtypeOptions: Record<
    string,
    { id: string; name: string; description: string }[]
  > = {
    space: [
      {
        id: "meetings",
        name: "Meetings",
        description: "Dedicated meeting and conference spaces.",
      },
      {
        id: "collaboration",
        name: "Collaboration",
        description: "Open collaborative work areas and team spaces.",
      },
      {
        id: "focus",
        name: "Focus",
        description: "Quiet individual work and concentration areas.",
      },
      {
        id: "social-lounge",
        name: "Social / Lounge",
        description: "Casual social and networking spaces.",
      },
      {
        id: "food-beverage",
        name: "Food & Beverage",
        description: "Dining areas, cafes, and kitchen facilities.",
      },
      {
        id: "event-hosting",
        name: "Event / Hosting",
        description: "Large venues for events and gatherings.",
      },
      {
        id: "outdoor",
        name: "Outdoor",
        description: "Outdoor workspaces and recreational areas.",
      },
      {
        id: "showrooms",
        name: "Showrooms",
        description: "Display and presentation spaces.",
      },
      {
        id: "lab-rd",
        name: "Lab / R&D",
        description: "Research and development facilities.",
      },
      {
        id: "studios-creative",
        name: "Studios / Creative",
        description: "Creative workspaces and studios.",
      },
      {
        id: "manufacturing-light-industrial",
        name: "Manufacturing / Light Industrial",
        description: "Light manufacturing and industrial spaces.",
      },
      {
        id: "hybrid-work-zones",
        name: "Hybrid Work Zones",
        description: "Flexible spaces for hybrid work arrangements.",
      },
      {
        id: "reception-arrival",
        name: "Reception & Arrival",
        description: "Welcome areas and reception spaces.",
      },
    ],
    service: [
      {
        id: "technology-support",
        name: "Technology Support",
        description: "IT support, AV setup, and technical assistance.",
      },
      {
        id: "hospitality-services",
        name: "Hospitality Services",
        description: "Concierge, reception, and guest services.",
      },
      {
        id: "experience-programming",
        name: "Experience Programming",
        description: "Events, activities, and community programming.",
      },
      {
        id: "communications",
        name: "Communications",
        description: "Internal and external communication services.",
      },
      {
        id: "security-access",
        name: "Security & Access",
        description: "Security services and access management.",
      },
      {
        id: "maintenance-ops",
        name: "Maintenance & Ops",
        description: "Facility maintenance and operational services.",
      },
      {
        id: "amenity-management",
        name: "Amenity Management",
        description: "Management and operation of building amenities.",
      },
      {
        id: "food-beverage",
        name: "Food & Beverage",
        description: "Catering, dining, and beverage services.",
      },
      {
        id: "transportation",
        name: "Transportation",
        description: "Transportation and mobility services.",
      },
      {
        id: "feedback-support",
        name: "Feedback & Support",
        description: "Customer support and feedback management.",
      },
      {
        id: "move-in-onboarding",
        name: "Move-in/Onboarding",
        description: "New tenant onboarding and move-in services.",
      },
      {
        id: "sustainability",
        name: "Sustainability",
        description: "Environmental and sustainability services.",
      },
    ],
    "event-program": [
      {
        id: "one-time-event",
        name: "One-time Event",
        description: "Single session; ticket inventory.",
      },
      {
        id: "recurring-program",
        name: "Recurring Program",
        description: "Multi-session series; per-session tickets.",
      },
      {
        id: "workshop-training",
        name: "Workshop / Training",
        description: "Instructor-led session; ticket inventory.",
      },
      {
        id: "fitness-class",
        name: "Fitness Class",
        description: "Class with capacity; ticket inventory.",
      },
      {
        id: "networking-event",
        name: "Networking Event",
        description: "Community event; ticket inventory.",
      },
      {
        id: "seasonal-activation",
        name: "Seasonal Activation",
        description: "Limited-run activation; ticket inventory.",
      },
      {
        id: "custom",
        name: "Custom",
        description: "Define your own event subtype.",
      },
    ],
    other: [
      { id: "custom", name: "Custom", description: "Define your own subtype." },
    ],
  };

  // Handler functions
  const handleProductTypeSelect = (typeId: string) => {
    setSelectedProductType(typeId);
    setSelectedSubtype("");
  };

  const handleSubtypeSelect = (subtypeId: string) => {
    setSelectedSubtype(subtypeId);
  };

  const toggleOnboardType = (typeId: string) => {
    setSelectedOnboardTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const setCount = (typeId: string, value: string) => {
    const num = Math.max(0, parseInt(value || "0", 10) || 0);
    setTypeCounts((prev) => ({ ...prev, [typeId]: num }));
  };

  const categoriesWithoutAll = categories.filter((c) => c.id !== "all");

  const visibleSubtypes = subtypes.filter(
    (st) =>
      selectedCategories.includes("all") || selectedCategories.includes(st.type)
  );

  // Tailwind color tokens per top-level type
  const styleByType: Record<
    string,
    {
      from: string;
      hoverBorder: string;
      badgeBg: string;
      badgeText: string;
      badgeBorder: string;
      chip: string;
    }
  > = {
    Space: {
      from: "from-blue-50",
      hoverBorder: "hover:border-blue-300",
      badgeBg: "bg-blue-100",
      badgeText: "text-blue-800",
      badgeBorder: "border-blue-200",
      chip: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    Service: {
      from: "from-orange-50",
      hoverBorder: "hover:border-orange-300",
      badgeBg: "bg-orange-100",
      badgeText: "text-orange-800",
      badgeBorder: "border-orange-200",
      chip: "bg-orange-600 hover:bg-orange-700 text-white",
    },
    "Event / Program": {
      from: "from-purple-50",
      hoverBorder: "hover:border-purple-300",
      badgeBg: "bg-purple-100",
      badgeText: "text-purple-800",
      badgeBorder: "border-purple-200",
      chip: "bg-purple-600 hover:bg-purple-700 text-white",
    },
  };

  const totalsByCategory: Record<string, number> = categoriesWithoutAll.reduce(
    (acc, c) => {
      const sum = subtypes
        .filter((st) => st.type === c.id)
        .reduce(
          (n, st) =>
            n + (typeof st.stats.total === "number" ? st.stats.total : 0),
          0
        );
      acc[c.id] = sum;
      return acc;
    },
    {} as Record<string, number>
  );

  const missingCategories = categoriesWithoutAll.filter(
    (c) => (totalsByCategory[c.id] ?? 0) === 0
  );
  const underrepresentedCategories = categoriesWithoutAll.filter(
    (c) =>
      (totalsByCategory[c.id] ?? 0) > 0 && (totalsByCategory[c.id] ?? 0) <= 2
  );
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Offerings overview
            </h1>
            <p className="text-gray-600 mt-1">
              Key stats and metrics by offering subtype.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Dialog
              open={isOnboardOpen}
              onOpenChange={(open) => {
                setIsOnboardOpen(open);
                if (!open) {
                  setOnboardStep(1);
                  setSelectedOnboardTypes([]);
                  setTypeCounts({});
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsOnboardOpen(true)}
                >
                  Onboard
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    Set up your building
                  </DialogTitle>
                  <p className="text-muted-foreground">
                    Tell us what types of offerings you have and how many. We'll
                    help you create them faster.
                  </p>
                </DialogHeader>

                {onboardStep === 1 && (
                  <div className="mt-4">
                    <h3 className="text-md font-medium mb-4">
                      Which types of offerings do you have?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {productTypes.map((type) => (
                        <Card
                          key={type.id}
                          className={`cursor-pointer border-2 ${selectedOnboardTypes.includes(type.id) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                          onClick={() => toggleOnboardType(type.id)}
                        >
                          <CardContent className="p-4 flex items-center gap-3">
                            <Checkbox
                              checked={selectedOnboardTypes.includes(type.id)}
                              onCheckedChange={() => toggleOnboardType(type.id)}
                            />
                            <div className="flex items-center gap-2">
                              <type.icon className="w-5 h-5 text-gray-600" />
                              <span className="font-medium">{type.name}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsOnboardOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => setOnboardStep(2)}
                        disabled={selectedOnboardTypes.length === 0}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {onboardStep === 2 && (
                  <div className="mt-4">
                    <h3 className="text-md font-medium mb-4">
                      How many of each do you have?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedOnboardTypes.map((typeId) => {
                        const t = productTypes.find((pt) => pt.id === typeId)!;
                        return (
                          <div key={typeId}>
                            <label className="text-sm text-gray-700">
                              {t.name}
                            </label>
                            <Input
                              type="number"
                              className="mt-1"
                              placeholder="0"
                              value={(typeCounts[typeId] ?? 0).toString()}
                              onChange={(e) => setCount(typeId, e.target.value)}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-6 flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setOnboardStep(1)}
                      >
                        Back
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsOnboardOpen(false)}
                        >
                          Skip
                        </Button>
                        <Button
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => setOnboardStep(3)}
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {onboardStep === 3 && (
                  <div className="mt-4">
                    <h3 className="text-md font-medium mb-4">Summary</h3>
                    <div className="space-y-2">
                      {selectedOnboardTypes.map((typeId) => {
                        const t = productTypes.find((pt) => pt.id === typeId)!;
                        return (
                          <div
                            key={typeId}
                            className="flex justify-between border rounded-md p-3"
                          >
                            <span className="font-medium">{t.name}</span>
                            <span className="text-gray-700">
                              {typeCounts[typeId] ?? 0}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-6 flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setOnboardStep(2)}
                      >
                        Back
                      </Button>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => setIsOnboardOpen(false)}
                      >
                        Finish onboarding
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsCreateProductOpen(true)}
            >
              Create offering
            </Button>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              const chipColor =
                cat.id !== "all"
                  ? styleByType[cat.id]?.chip
                  : "bg-gray-900 hover:bg-gray-800 text-white";
              return (
                <Button
                  key={cat.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`h-8 px-3 rounded-full ${isSelected ? chipColor : ""}`}
                  onClick={() => {
                    if (cat.id === "all") {
                      setSelectedCategories(["all"]); // reset to all
                      return;
                    }
                    setSelectedCategories((prev) => {
                      const withoutAll = prev.filter((p) => p !== "all");
                      const next = withoutAll.includes(cat.id)
                        ? withoutAll.filter((p) => p !== cat.id)
                        : [...withoutAll, cat.id];
                      return next.length === 0 ? ["all"] : next;
                    });
                  }}
                >
                  {cat.name}
                </Button>
              );
            })}
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
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-8 w-8 p-0 rounded-l-none"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Cards View */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6 pb-8">
            {visibleSubtypes.map((st) => (
              <Link
                key={st.id}
                href={`/experience/offerings/browse/${st.type.toLowerCase().replace(/[\s\/]/g, "-")}/${st.id}`}
                className="block"
              >
                <Card
                  className={`border-2 ${styleByType[st.type]?.hoverBorder || ""} transition-colors bg-gradient-to-br ${styleByType[st.type]?.from || "from-gray-50"} to-white cursor-pointer hover:shadow-md`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm text-gray-500">{st.type}</div>
                        <div className="text-base font-semibold text-gray-900">
                          {st.name}
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs border ${styleByType[st.type]?.badgeBg || ""} ${styleByType[st.type]?.badgeText || ""} ${styleByType[st.type]?.badgeBorder || ""}`}
                      >
                        {st.stats.utilization} utilization
                      </Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-gray-500">Total</div>
                        <div className="font-medium">{st.stats.total}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Active</div>
                        <div className="font-medium">{st.stats.active}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Avg Price</div>
                        <div className="font-medium">{st.stats.avgPrice}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <div className="px-6 pb-8">
            <div className="bg-white border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Avg Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleSubtypes.map((st) => (
                    <TableRow
                      key={st.id}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-xs border ${styleByType[st.type]?.badgeBg || ""} ${styleByType[st.type]?.badgeText || ""} ${styleByType[st.type]?.badgeBorder || ""}`}
                        >
                          {st.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link
                          href={`/experience/offerings/browse/${st.type.toLowerCase().replace(/[\s\/]/g, "-")}/${st.id}`}
                          className="hover:text-blue-600"
                        >
                          {st.name}
                        </Link>
                      </TableCell>
                      <TableCell>{st.stats.total}</TableCell>
                      <TableCell>{st.stats.active}</TableCell>
                      <TableCell>{st.stats.utilization}</TableCell>
                      <TableCell>{st.stats.avgPrice}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {(missingCategories.length > 0 ||
          underrepresentedCategories.length > 0) && (
          <div className="px-6 pb-10 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Opportunities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {missingCategories.map((cat) => (
                <Card
                  key={`missing-${cat.id}`}
                  className="border-2 border-dashed"
                >
                  <CardContent className="p-5">
                    <div className="text-sm text-gray-500">{cat.name}</div>
                    <div className="text-base font-semibold text-gray-900 mt-1">
                      No offerings yet
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{cat.benefit}</p>
                    <div className="mt-4">
                      <Link href="/experience/offerings">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Create offering
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {underrepresentedCategories.map((cat) => (
                <Card key={`underrep-${cat.id}`} className="border-2">
                  <CardContent className="p-5">
                    <div className="text-sm text-gray-500">{cat.name}</div>
                    <div className="text-base font-semibold text-gray-900 mt-1">
                      Low coverage ({totalsByCategory[cat.id]})
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{cat.benefit}</p>
                    <div className="mt-4">
                      <Link href="/experience/offerings">
                        <Button variant="outline">Create offering</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Offering Modal */}
      <Dialog open={isCreateProductOpen} onOpenChange={setIsCreateProductOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Create new offering
            </DialogTitle>
            <p className="text-muted-foreground mt-2">
              Choose the type of offering you want to create. This will help us
              customize the creation form for your specific needs.
            </p>
          </DialogHeader>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Select offering type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {productTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`relative cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                    selectedProductType === type.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleProductTypeSelect(type.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <type.icon className="w-8 h-8 text-gray-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {type.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {type.description}
                        </p>
                      </div>
                    </div>
                    {selectedProductType === type.id && (
                      <div className="absolute top-3 right-3">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedProductType && (
              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  Select subtype
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(subtypeOptions[selectedProductType] || []).map((sub) => (
                    <Card
                      key={sub.id}
                      className={`relative cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                        selectedSubtype === sub.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleSubtypeSelect(sub.id)}
                    >
                      <CardContent className="p-5">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-gray-900">
                            {sub.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {sub.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedProductType("");
                      setSelectedSubtype("");
                      setIsCreateProductOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Link
                    href={`/experience/offerings/create?type=${selectedProductType}${selectedSubtype ? `&subtype=${selectedSubtype}` : ""}`}
                  >
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!selectedSubtype}
                      onClick={() => {
                        setIsCreateProductOpen(false);
                        setSelectedProductType("");
                        setSelectedSubtype("");
                      }}
                    >
                      Continue
                      {selectedSubtype
                        ? ` with ${subtypeOptions[selectedProductType]?.find((s) => s.id === selectedSubtype)?.name}`
                        : ""}
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

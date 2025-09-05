"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, DollarSign, Clock, ShoppingCart, Plus } from "lucide-react";
import { mockBuildings, mockLeases } from "@/lib/mockData";

interface CreditsTabProps {
  selectedBuildings: string[];
  tenantId?: string;
}

interface BuildingCredit {
  buildingId: string;
  buildingName: string;
  resourceBookingCredits: {
    used: number;
    total: number;
    dollarsUsed: number;
    dollarsTotal: number;
  };
  eventCredits: {
    used: number;
    total: number;
    dollarsUsed: number;
    dollarsTotal: number;
  };
  expirationDate: string;
}

interface CreditStats {
  totalBuildings: number;
  dollarsAssigned: number;
  hoursAssigned: number;
  dollarsUsed: number;
  hoursUsed: number;
}

export function CreditsTab({ selectedBuildings, tenantId = "1001" }: CreditsTabProps) {
  const [buildingCredits, setBuildingCredits] = useState<BuildingCredit[]>([]);
  const [creditStats, setCreditStats] = useState<CreditStats>({
    totalBuildings: 0,
    dollarsAssigned: 0,
    hoursAssigned: 0,
    dollarsUsed: 0,
    hoursUsed: 0,
  });
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  useEffect(() => {
    // Get tenant's leases to find buildings
    const tenantLeases = mockLeases.filter(lease => lease.tenant_id === tenantId);
    const buildingIds = [...new Set(tenantLeases.map(lease => lease.building_id))];

    // Generate mock credit data for each building
    const mockCredits: BuildingCredit[] = buildingIds.map((buildingId, index) => {
      const building = mockBuildings.find(b => b.uuid === buildingId);
      if (!building) return null;

      // Generate realistic credit data
      const resourceTotal = [2500, 3000, 1500][index] || 2000;
      const resourceUsed = Math.floor(resourceTotal * (0.6 + Math.random() * 0.3));
      const eventTotal = [2500, 4000, 1500][index] || 2000;
      const eventUsed = Math.floor(eventTotal * (0.4 + Math.random() * 0.4));

      const expirationDates = ["2024-12-31", "2024-11-30", "2025-01-15"];

      return {
        buildingId: building.uuid,
        buildingName: building.name,
        resourceBookingCredits: {
          used: resourceUsed,
          total: resourceTotal,
          dollarsUsed: resourceUsed,
          dollarsTotal: resourceTotal,
        },
        eventCredits: {
          used: eventUsed,
          total: eventTotal,
          dollarsUsed: eventUsed,
          dollarsTotal: eventTotal,
        },
        expirationDate: expirationDates[index] || "2024-12-31",
      };
    }).filter(Boolean) as BuildingCredit[];

    setBuildingCredits(mockCredits);

    // Calculate stats
    const stats: CreditStats = {
      totalBuildings: mockCredits.length,
      dollarsAssigned: mockCredits.reduce((sum, building) => 
        sum + building.resourceBookingCredits.dollarsTotal + building.eventCredits.dollarsTotal, 0),
      hoursAssigned: mockCredits.reduce((sum, building) => 
        sum + building.resourceBookingCredits.total + building.eventCredits.total, 0) / 100, // Convert to hours
      dollarsUsed: mockCredits.reduce((sum, building) => 
        sum + building.resourceBookingCredits.dollarsUsed + building.eventCredits.dollarsUsed, 0),
      hoursUsed: mockCredits.reduce((sum, building) => 
        sum + building.resourceBookingCredits.used + building.eventCredits.used, 0) / 100, // Convert to hours
    };

    setCreditStats(stats);
  }, [tenantId]);

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon,
    format = "number"
  }: {
    title: string;
    value: number;
    subtitle: string;
    icon: any;
    format?: "number" | "currency" | "hours";
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case "currency":
          return `$${val.toLocaleString()}`;
        case "hours":
          return `${val}h`;
        default:
          return val.toString();
      }
    };

    return (
      <Card className="p-6">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-600">{title}</div>
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatValue(value)}
          </div>
          <div className="text-sm text-gray-500">{subtitle}</div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Credits</h2>
          <p className="text-sm text-gray-500">
            Manage credit allocations and view tenant information
          </p>
        </div>
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Assign Credits
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Credits</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="building">Building</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select building" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildingCredits.map((building) => (
                      <SelectItem key={building.buildingId} value={building.buildingId}>
                        {building.buildingName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resourceCredits">Resource Booking Credits</Label>
                <Input id="resourceCredits" placeholder="Enter amount" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventCredits">Event Credits</Label>
                <Input id="eventCredits" placeholder="Enter amount" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiration">Expiration Date</Label>
                <Input id="expiration" type="date" />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-black text-white hover:bg-gray-800">
                  Assign Credits
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Dollars Assigned"
          value={creditStats.dollarsAssigned}
          subtitle="Across all buildings"
          icon={DollarSign}
          format="currency"
        />
        <StatCard
          title="Hours Assigned"
          value={creditStats.hoursAssigned}
          subtitle="Across all buildings"
          icon={Clock}
          format="hours"
        />
        <StatCard
          title="Dollars Used"
          value={creditStats.dollarsUsed}
          subtitle="This month"
          icon={ShoppingCart}
          format="currency"
        />
        <StatCard
          title="Hours Used"
          value={creditStats.hoursUsed}
          subtitle="This month"
          icon={Clock}
          format="hours"
        />
      </div>

      {/* Credit Management Table */}
      <Card>
        <CardContent className="p-0">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Credit Management</h3>
            <p className="text-sm text-gray-500 mt-1">
              Manage credit allocations and view building information
            </p>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100">
                <TableHead className="font-medium text-gray-900">Building</TableHead>
                <TableHead className="font-medium text-gray-900">Resource Booking Credits</TableHead>
                <TableHead className="font-medium text-gray-900">Event Credits</TableHead>
                <TableHead className="font-medium text-gray-900">Expiration Date</TableHead>
                <TableHead className="font-medium text-gray-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buildingCredits.map((building) => (
                <TableRow key={building.buildingId} className="border-gray-100">
                  <TableCell className="font-medium text-gray-900">
                    {building.buildingName}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        ${(building.resourceBookingCredits.total - building.resourceBookingCredits.used).toLocaleString()} of ${building.resourceBookingCredits.total.toLocaleString()} remaining
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        ${(building.eventCredits.total - building.eventCredits.used).toLocaleString()} of ${building.eventCredits.total.toLocaleString()} remaining
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {new Date(building.expirationDate).toLocaleDateString('en-US')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

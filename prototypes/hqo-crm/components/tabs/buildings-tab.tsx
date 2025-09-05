"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InlineEdit } from "@/components/ui/inline-edit";
import { Building2, MapPin, Calendar, Users, Square, Plus, X } from "lucide-react";
import { mockBuildings, mockLeases, mockSpaces } from "@/lib/mockData";

interface BuildingsTabProps {
  selectedBuildings: string[];
  tenantId?: string;
}

interface Suite {
  id: string;
  number: string;
  area?: number;
}

interface Floor {
  id: string;
  number: number;
  suites: Suite[];
}

interface BuildingData {
  id: string;
  name: string;
  address: string;
  image: string;
  floors: Floor[];
  totalRentedArea: number;
  employees: number;
  leaseExpiration: string;
}

export function BuildingsTab({
  selectedBuildings,
  tenantId = "1001",
}: BuildingsTabProps) {
  const [buildingsData, setBuildingsData] = useState<BuildingData[]>([]);

  useEffect(() => {
    // Get tenant's leases
    const tenantLeases = mockLeases.filter(
      (lease) => lease.tenant_id === tenantId
    );

    // Get unique building IDs from leases
    const buildingIds = [
      ...new Set(tenantLeases.map((lease) => lease.building_id)),
    ];

    // Get building data and calculate metrics
    const processedBuildings = buildingIds
      .map((buildingId) => {
        const building = mockBuildings.find((b) => b.uuid === buildingId);
        if (!building) return null;

        // Get all leases for this building and tenant
        const buildingLeases = tenantLeases.filter(
          (lease) => lease.building_id === buildingId
        );

        // Get spaces for this building
        const buildingSpaces = mockSpaces.filter(
          (space) => space.building_id === buildingId
        );

        // Group spaces by floor and create floor-suite structure
        const floorMap = new Map<number, Suite[]>();
        
        buildingSpaces.forEach((space) => {
          const floorNumber = space.floor || 1;
          if (!floorMap.has(floorNumber)) {
            floorMap.set(floorNumber, []);
          }
          floorMap.get(floorNumber)!.push({
            id: space.space_id.toString(),
            number: space.name || space.space_id.toString(),
            area: space.area,
          });
        });

        // Convert to floors array and sort by floor number
        const floors: Floor[] = Array.from(floorMap.entries())
          .map(([floorNumber, suites]) => ({
            id: `floor-${floorNumber}`,
            number: floorNumber,
            suites,
          }))
          .sort((a, b) => a.number - b.number);

        // Add some default floors if none exist
        if (floors.length === 0) {
          floors.push(
            {
              id: "floor-12",
              number: 12,
              suites: [
                { id: "suite-505", number: "505", area: 2500 },
                { id: "suite-506", number: "506", area: 3000 },
              ],
            },
            {
              id: "floor-13",
              number: 13,
              suites: [{ id: "suite-1000", number: "1000", area: 5000 }],
            }
          );
        }

        // Calculate total rented area
        const totalRentedArea = floors.reduce(
          (total, floor) =>
            total +
            floor.suites.reduce((floorTotal, suite) => floorTotal + (suite.area || 0), 0),
          0
        );

        // Get the latest lease expiration for this building
        const latestExpiration = buildingLeases
          .map((lease) => new Date(lease.expiration_date))
          .sort((a, b) => b.getTime() - a.getTime())[0];

        // Estimate employees (you can adjust this logic based on your business rules)
        const employees = Math.floor(totalRentedArea / 200); // Assuming 200 sq ft per employee

        return {
          id: building.uuid,
          name: building.name,
          address: building.formatted_address,
          image: `https://images.unsplash.com/photo-${building.uuid.slice(-10)}?w=400&h=200&fit=crop&crop=entropy&auto=format&q=80`,
          floors,
          totalRentedArea,
          employees,
          leaseExpiration: latestExpiration
            ? latestExpiration.toLocaleDateString("en-US")
            : "N/A",
        };
      })
      .filter(Boolean) as BuildingData[];

    setBuildingsData(processedBuildings);
  }, [tenantId]);

  const handleFieldUpdate = (
    buildingId: string,
    field: keyof BuildingData,
    value: string
  ) => {
    setBuildingsData((prev) =>
      prev.map((building) => {
        if (building.id === buildingId) {
          // Convert string values to appropriate types
          let convertedValue: any = value;
          if (field === "employees") {
            convertedValue = parseInt(value, 10) || 0;
          } else if (field === "totalRentedArea") {
            convertedValue = parseFloat(value) || 0;
          }

          return {
            ...building,
            [field]: convertedValue,
          };
        }
        return building;
      })
    );

    // In a real app, you would also make an API call here to save the data
    console.log(`Updated ${field} for building ${buildingId}:`, value);
  };

  const addFloor = (buildingId: string) => {
    setBuildingsData((prev) =>
      prev.map((building) => {
        if (building.id === buildingId) {
          const maxFloorNumber = Math.max(...building.floors.map(f => f.number), 0);
          const newFloor: Floor = {
            id: `floor-${maxFloorNumber + 1}`,
            number: maxFloorNumber + 1,
            suites: [],
          };
          return {
            ...building,
            floors: [...building.floors, newFloor].sort((a, b) => a.number - b.number),
          };
        }
        return building;
      })
    );
  };

  const addSuite = (buildingId: string, floorId: string) => {
    setBuildingsData((prev) =>
      prev.map((building) => {
        if (building.id === buildingId) {
          return {
            ...building,
            floors: building.floors.map((floor) => {
              if (floor.id === floorId) {
                const newSuiteId = `suite-${Date.now()}`;
                const newSuite: Suite = {
                  id: newSuiteId,
                  number: "",
                  area: 0,
                };
                return {
                  ...floor,
                  suites: [...floor.suites, newSuite],
                };
              }
              return floor;
            }),
          };
        }
        return building;
      })
    );
  };

  const removeSuite = (buildingId: string, floorId: string, suiteId: string) => {
    setBuildingsData((prev) =>
      prev.map((building) => {
        if (building.id === buildingId) {
          return {
            ...building,
            floors: building.floors.map((floor) => {
              if (floor.id === floorId) {
                return {
                  ...floor,
                  suites: floor.suites.filter((suite) => suite.id !== suiteId),
                };
              }
              return floor;
            }),
          };
        }
        return building;
      })
    );
  };

  const updateSuite = (buildingId: string, floorId: string, suiteId: string, number: string) => {
    setBuildingsData((prev) =>
      prev.map((building) => {
        if (building.id === buildingId) {
          return {
            ...building,
            floors: building.floors.map((floor) => {
              if (floor.id === floorId) {
                return {
                  ...floor,
                  suites: floor.suites.map((suite) => {
                    if (suite.id === suiteId) {
                      return { ...suite, number };
                    }
                    return suite;
                  }),
                };
              }
              return floor;
            }),
          };
        }
        return building;
      })
    );
  };

  if (buildingsData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No buildings found for this tenant</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Buildings</h2>
        <p className="text-sm text-gray-500">
          Manage building details and occupancy information
        </p>
      </div>

      <div className="space-y-4">
        {buildingsData.map((building) => (
          <Card key={building.id} className="w-full">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {/* Building Image */}
                <div className="flex-shrink-0">
                  <Avatar className="h-16 w-16 rounded-lg">
                    <AvatarImage
                      src={building.image}
                      alt={building.name}
                      className="object-cover rounded-lg"
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-700 rounded-lg text-lg font-medium">
                      {building.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Building Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {building.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {building.address}
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      • Active
                    </Badge>
                  </div>

                  {/* Floors and Suites */}
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      Floors & Suites
                    </div>
                    
                    {building.floors.map((floor) => (
                      <div key={floor.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          {/* Floor Number */}
                          <div>
                            <div className="text-sm font-medium text-gray-600 mb-1">Floor</div>
                            <div className="text-lg font-semibold text-gray-900">
                              {floor.number}
                            </div>
                          </div>
                          
                          {/* Suites */}
                          <div>
                            <div className="text-sm font-medium text-gray-600 mb-2">Suite</div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {floor.suites.map((suite) => (
                                <div
                                  key={suite.id}
                                  className="flex items-center bg-white border border-gray-200 rounded px-2 py-1"
                                >
                                  <InlineEdit
                                    value={suite.number}
                                    onSave={(value) =>
                                      updateSuite(building.id, floor.id, suite.id, value)
                                    }
                                    placeholder="Suite number"
                                    displayClassName="text-sm font-medium text-gray-900"
                                  />
                                  <button
                                    onClick={() => removeSuite(building.id, floor.id, suite.id)}
                                    className="ml-2 text-gray-400 hover:text-red-500"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => addSuite(building.id, floor.id)}
                                className="flex items-center px-2 py-1 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100"
                              >
                                Add Suite
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Floor Button */}
                    <button
                      onClick={() => addFloor(building.id)}
                      className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Floor
                    </button>
                  </div>

                  {/* Other Editable Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {/* Rented Area */}
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        Rented Area (sq ft)
                      </div>
                      <InlineEdit
                        value={building.totalRentedArea.toLocaleString()}
                        onSave={(value) =>
                          handleFieldUpdate(
                            building.id,
                            "totalRentedArea",
                            value.replace(/,/g, "")
                          )
                        }
                        placeholder="Enter rented area..."
                        displayClassName="text-lg font-semibold text-gray-900"
                      />
                    </div>

                    {/* Employees */}
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Employees
                      </div>
                      <InlineEdit
                        value={building.employees.toString()}
                        onSave={(value) =>
                          handleFieldUpdate(building.id, "employees", value)
                        }
                        placeholder="Enter employee count..."
                        displayClassName="text-lg font-semibold text-gray-900"
                      />
                    </div>

                    {/* Lease Expiration */}
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Lease Expiration
                      </div>
                      <InlineEdit
                        value={building.leaseExpiration}
                        onSave={(value) =>
                          handleFieldUpdate(
                            building.id,
                            "leaseExpiration",
                            value
                          )
                        }
                        placeholder="Enter expiration date..."
                        displayClassName="text-lg font-semibold text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Quick Stats Bar */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {building.floors.length}
                        </div>
                        <div className="text-xs text-gray-500">
                          Total Floors
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {building.totalRentedArea.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Sq Ft Rented
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {building.employees}
                        </div>
                        <div className="text-xs text-gray-500">Employees</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

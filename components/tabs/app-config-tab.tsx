"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Building, Settings, ChevronRight } from "lucide-react";

interface AppConfigTabProps {
  selectedBuildings: string[];
}

// Mock building data
const buildingsData = [
  {
    id: "cobblestone",
    name: "Cobblestone Collaborative",
    address: "123 Innovation Drive, Tech District",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop&crop=entropy&auto=format&q=80",
    fallbackColor: "bg-blue-100 text-blue-700",
    initials: "CC",
  },
  {
    id: "metro-tower",
    name: "Metro Tower",
    address: "456 Business Blvd, Downtown",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=400&fit=crop&crop=entropy&auto=format&q=80",
    fallbackColor: "bg-purple-100 text-purple-700",
    initials: "MT",
  },
  {
    id: "innovation-hub",
    name: "Innovation Hub",
    address: "789 Startup Street, Creative Quarter",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=400&fit=crop&crop=entropy&auto=format&q=80",
    fallbackColor: "bg-orange-100 text-orange-700",
    initials: "IH",
  },
];

export function AppConfigTab({ selectedBuildings }: AppConfigTabProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuildingClick = (buildingId: string) => {
    setSelectedBuilding(buildingId);
    setIsModalOpen(true);
  };

  const currentBuilding = buildingsData.find((b) => b.id === selectedBuilding);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          Building App Configuration
        </h2>
        <p className="text-sm text-gray-500">
          Select a building to configure its app settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {buildingsData.map((building) => (
          <Card
            key={building.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={building.image}
                      alt={building.name}
                      className="object-cover"
                    />
                    <AvatarFallback className={building.fallbackColor}>
                      {building.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {building.name}
                    </h3>
                    <p className="text-sm text-gray-500">{building.address}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  • {building.status}
                </Badge>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleBuildingClick(building.id)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure app settings
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Building Configuration Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b bg-white">
            <DialogTitle>
              App Configuration - {currentBuilding?.name}
            </DialogTitle>
          </DialogHeader>

          {currentBuilding && (
            <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-6">
              <div className="space-y-6">
                {/* Active Configuration */}
                <div className="bg-white rounded-lg border p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Active configuration
                    </h3>
                  </div>

                  <div className="grid grid-cols-6 gap-8">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700 mb-3">
                        Submit Request
                      </div>
                      <Switch defaultChecked className="mx-auto" />
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700 mb-3">
                        Book Space
                      </div>
                      <Switch defaultChecked className="mx-auto" />
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700 mb-3">
                        Register a Visitor
                      </div>
                      <Switch defaultChecked className="mx-auto" />
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700 mb-3">
                        Digital Key
                      </div>
                      <Switch className="mx-auto" />
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700 mb-3">
                        Foodhub
                      </div>
                      <Switch defaultChecked className="mx-auto" />
                    </div>

                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-700 mb-3">
                        Signature
                      </div>
                      <div className="text-sm text-gray-600">Liz Thomson</div>
                      <div className="text-sm text-gray-600">May 28, 2025</div>
                    </div>
                  </div>
                </div>

                {/* Past Configurations */}
                <div className="bg-white rounded-lg border">
                  <div className="p-6 pb-0">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                      Past configurations
                    </h3>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">
                          Submit Request
                        </TableHead>
                        <TableHead className="text-center">
                          Book Space
                        </TableHead>
                        <TableHead className="text-center">
                          Register a Visitor
                        </TableHead>
                        <TableHead className="text-center">
                          Digital Key
                        </TableHead>
                        <TableHead className="text-center">Foodhub</TableHead>
                        <TableHead>Signature</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
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
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
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
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
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
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
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
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          liz thomson
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          May 28, 2025
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
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
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
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
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
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
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
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
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          liz thomson
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          May 28, 2025
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
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
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
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
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
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
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Ashley Colella
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Apr 14, 2025
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
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
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
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
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
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
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
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
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Ashley Colella
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Apr 14, 2025
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 px-6 py-4 border-t bg-white mt-0">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Save changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

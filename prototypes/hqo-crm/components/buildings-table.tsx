"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, Link2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Building = {
  id: string
  name: string
  image: string
  area: string
  areaUnit: string
  responses: string
  assessment: string
}

type BuildingsTableProps = {
  buildings: Building[]
}

export function BuildingsTable({ buildings }: BuildingsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Building</TableHead>
            <TableHead>Date & time</TableHead>
            <TableHead>Responses</TableHead>
            <TableHead>Assessment</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buildings.map((building) => (
            <TableRow key={building.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 rounded-md">
                    <AvatarImage
                      src={building.image || "/placeholder.svg"}
                      alt={building.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-md">{building.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span>{building.name}</span>
                </div>
              </TableCell>
              <TableCell>{`${building.area} ${building.areaUnit}`}</TableCell>
              <TableCell>{building.responses}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{building.assessment}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Link2 className="mr-2 h-4 w-4" />
                  Generate link
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

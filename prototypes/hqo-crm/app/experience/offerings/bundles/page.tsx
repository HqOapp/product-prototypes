"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertBanner } from "@/components/ui/alert-banner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"

const mockBundles = [
  {
    id: "b1",
    name: "Move-In Package (Furniture + IT + AV)",
    description: "Turnkey setup across furniture, IT, and AV",
    items: ["Furniture Setup", "IT Setup", "AV Support"],
    status: "published",
  },
  {
    id: "b2",
    name: "Event Hall + Catering + AV",
    description: "Pre-packaged event bundle for large events",
    items: ["Event Hall", "Catering – Premium", "AV Support"],
    status: "draft",
  },
]

export default function BundlesPage() {
  const [search, setSearch] = useState("")

  const filtered = mockBundles.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Bundles</h1>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create bundle
            </Button>
          </div>

          <AlertBanner
            title="About Bundles"
            description="Bundles are groups of offerings packaged together (e.g., space + services). Use bundles to streamline setup and selling."
          />

          <div className="mt-6 flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by bundle name or description"
                className="pl-9 w-72"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 pb-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="text-left font-medium text-gray-500">Bundle</TableHead>
                    <TableHead className="text-left font-medium text-gray-500">Items</TableHead>
                    <TableHead className="text-left font-medium text-gray-500">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((b) => (
                    <TableRow key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <TableCell className="py-4">
                        <div className="font-medium text-gray-900">{b.name}</div>
                        <div className="text-sm text-gray-500">{b.description}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-wrap gap-1">
                          {b.items.map((i, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">{i}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={b.status === 'published' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
                          • {b.status === 'published' ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}



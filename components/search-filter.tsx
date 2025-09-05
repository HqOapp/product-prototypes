"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Filter, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SearchFilterProps {
  onSearchChange: (search: string) => void
  onProductFilterChange: (products: string[]) => void
  usedProductCategories: string[]
}

export function SearchFilter({ onSearchChange, onProductFilterChange, usedProductCategories }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearchChange(value)
  }

  const handleProductToggle = (product: string) => {
    setSelectedProducts((prev) => {
      const newSelection = prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product]

      onProductFilterChange(newSelection)
      return newSelection
    })
  }

  const clearSearch = () => {
    setSearchTerm("")
    onSearchChange("")
  }

  const clearFilters = () => {
    setSelectedProducts([])
    onProductFilterChange([])
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div className="relative w-full md:w-auto flex-1 max-w-sm">
        <Label htmlFor="search" className="sr-only">
          Search projects
        </Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            placeholder="Search projects..."
            className="pl-9 pr-9"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button onClick={clearSearch} className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {selectedProducts.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="h-9 px-2 text-xs">
            Clear filters
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Tags
              {selectedProducts.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700 font-normal text-xs">
                  {selectedProducts.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 max-h-[60vh] overflow-auto">
            <DropdownMenuLabel>Filter by tags</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {usedProductCategories.map((product) => (
              <DropdownMenuCheckboxItem
                key={product}
                checked={selectedProducts.includes(product)}
                onCheckedChange={() => handleProductToggle(product)}
              >
                {product}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

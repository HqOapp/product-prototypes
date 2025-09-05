"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Search, Building2, Users, Truck, CreditCard, UserCheck, X } from "lucide-react"

interface SearchResult {
  id: string
  name: string
  type: string
  icon: React.ElementType
  description?: string
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: "1",
      name: "EcoVolt Energy Solutions",
      type: "tenant",
      icon: Users,
      description: "Renewable Energy • 157 employees",
    },
    {
      id: "2",
      name: "Cobblestone Collaborative",
      type: "building",
      icon: Building2,
      description: "Office Building • 85% occupied",
    },
    { id: "3", name: "Metro Tower", type: "building", icon: Building2, description: "Office Building • 92% occupied" },
    { id: "4", name: "CleanTech Services", type: "vendor", icon: Truck, description: "Cleaning Services • Active" },
    { id: "5", name: "Alex Morgan", type: "user", icon: UserCheck, description: "CEO at EcoVolt Energy Solutions" },
    {
      id: "6",
      name: "Rent Payment - Jan 2023",
      type: "transaction",
      icon: CreditCard,
      description: "$42,500 • EcoVolt Energy Solutions",
    },
  ]

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    if (query) {
      const filtered = mockResults.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.type.toLowerCase().includes(query.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(query.toLowerCase())),
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [query])

  return (
    <>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            ref={inputRef}
            placeholder="Search across your CRM..."
            value={query}
            onValueChange={setQuery}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
          {query && (
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-md" onClick={() => setQuery("")}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {results.length > 0 && (
            <>
              <CommandGroup heading="Tenants">
                {results
                  .filter((result) => result.type === "tenant")
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => {
                        setOpen(false)
                      }}
                    >
                      <result.icon className="mr-2 h-4 w-4" />
                      <span>{result.name}</span>
                      {result.description && (
                        <span className="text-xs text-muted-foreground ml-2">{result.description}</span>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Buildings">
                {results
                  .filter((result) => result.type === "building")
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => {
                        setOpen(false)
                      }}
                    >
                      <result.icon className="mr-2 h-4 w-4" />
                      <span>{result.name}</span>
                      {result.description && (
                        <span className="text-xs text-muted-foreground ml-2">{result.description}</span>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Other Results">
                {results
                  .filter((result) => !["tenant", "building"].includes(result.type))
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => {
                        setOpen(false)
                      }}
                    >
                      <result.icon className="mr-2 h-4 w-4" />
                      <span>{result.name}</span>
                      {result.description && (
                        <span className="text-xs text-muted-foreground ml-2">{result.description}</span>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

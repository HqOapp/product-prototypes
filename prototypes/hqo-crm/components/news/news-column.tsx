"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { NewsCard } from "@/components/news/news-card"
import { NewsCardSkeleton } from "@/components/news/news-card-skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw, Filter, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Column } from "@/components/news/news-dashboard"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface NewsColumnProps {
  column: Column
  onRemove?: () => void
  onRefresh: () => void
}

export function NewsColumn({ column, onRemove, onRefresh }: NewsColumnProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleRefresh = () => {
    setIsLoading(true)
    onRefresh()

    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const toggleFilter = (value: string) => {
    setSelectedFilters((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const clearFilters = () => {
    setSelectedFilters([])
    setSearchQuery("")
  }

  const applyFilters = () => {
    // In a real app, this would filter the news items
    console.log("Applied filters:", selectedFilters)
  }

  // Handle scroll to make header sticky
  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    const handleScroll = () => {
      if (content.scrollTop > 10) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }

    content.addEventListener("scroll", handleScroll)
    return () => {
      content.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-[350px] bg-card rounded-lg border shadow-sm">
      <div
        ref={headerRef}
        className={cn(
          "p-3 border-b flex items-center justify-between transition-all duration-200",
          isSticky && "bg-card/95 backdrop-blur-sm shadow-sm",
        )}
        style={{
          position: isSticky ? "sticky" : "relative",
          top: 0,
          zIndex: 10,
        }}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm">{column.title}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{column.items.length}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRefresh}>
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {column.title.includes("tenants") ? (
                <>
                  <div className="px-2 py-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search tenants..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full h-8 px-3 py-1 text-xs rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                  </div>
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Select tenants to filter</div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {[
                      "Acme Corp",
                      "Globex",
                      "Initech",
                      "Massive Dynamic",
                      "Stark Industries",
                      "Wayne Enterprises",
                      "Umbrella Corporation",
                    ]
                      .filter((tenant) => tenant.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((tenant) => (
                        <div key={tenant} className="px-2 py-1.5 flex items-center">
                          <Checkbox
                            id={`tenant-${tenant}`}
                            checked={selectedFilters.includes(tenant)}
                            onCheckedChange={() => toggleFilter(tenant)}
                            className="h-3.5 w-3.5"
                          />
                          <Label htmlFor={`tenant-${tenant}`} className="ml-2 text-xs cursor-pointer">
                            {tenant}
                          </Label>
                        </div>
                      ))}
                  </div>
                  <div className="border-t mt-2 pt-2 px-2 flex justify-between">
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={clearFilters}>
                      Clear
                    </Button>
                    <Button size="sm" className="h-7 text-xs" onClick={applyFilters}>
                      Apply
                    </Button>
                  </div>
                </>
              ) : column.title.includes("assets") ? (
                <>
                  <div className="px-2 py-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search buildings..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full h-8 px-3 py-1 text-xs rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                  </div>
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Select buildings to filter</div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {[
                      "One Liberty Plaza",
                      "Empire State Building",
                      "Chrysler Building",
                      "Willis Tower",
                      "Transamerica Pyramid",
                      "Salesforce Tower",
                      "30 Hudson Yards",
                    ]
                      .filter((building) => building.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((building) => (
                        <div key={building} className="px-2 py-1.5 flex items-center">
                          <Checkbox
                            id={`building-${building}`}
                            checked={selectedFilters.includes(building)}
                            onCheckedChange={() => toggleFilter(building)}
                            className="h-3.5 w-3.5"
                          />
                          <Label htmlFor={`building-${building}`} className="ml-2 text-xs cursor-pointer">
                            {building}
                          </Label>
                        </div>
                      ))}
                  </div>
                  <div className="border-t mt-2 pt-2 px-2 flex justify-between">
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={clearFilters}>
                      Clear
                    </Button>
                    <Button size="sm" className="h-7 text-xs" onClick={applyFilters}>
                      Apply
                    </Button>
                  </div>
                </>
              ) : column.title.includes("industry") ? (
                <>
                  <div className="px-2 py-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search regions..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full h-8 px-3 py-1 text-xs rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                  </div>
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Select regions to filter</div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {[
                      "Northeast",
                      "Midwest",
                      "South",
                      "West",
                      "Pacific Northwest",
                      "Southwest",
                      "Mid-Atlantic",
                      "New England",
                      "Great Lakes",
                      "Rocky Mountain",
                      "International - Europe",
                      "International - Asia",
                      "International - Latin America",
                    ]
                      .filter((region) => region.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((region) => (
                        <div key={region} className="px-2 py-1.5 flex items-center">
                          <Checkbox
                            id={`region-${region}`}
                            checked={selectedFilters.includes(region)}
                            onCheckedChange={() => toggleFilter(region)}
                            className="h-3.5 w-3.5"
                          />
                          <Label htmlFor={`region-${region}`} className="ml-2 text-xs cursor-pointer">
                            {region}
                          </Label>
                        </div>
                      ))}
                  </div>
                  <div className="border-t mt-2 pt-2 px-2 flex justify-between">
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={clearFilters}>
                      Clear
                    </Button>
                    <Button size="sm" className="h-7 text-xs" onClick={applyFilters}>
                      Apply
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <DropdownMenuItem>Most Recent</DropdownMenuItem>
                  <DropdownMenuItem>Most Relevant</DropdownMenuItem>
                  <DropdownMenuItem>By Source</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Expand Column</DropdownMenuItem>
              <DropdownMenuItem>Mark All as Read</DropdownMenuItem>
              {onRemove && (
                <DropdownMenuItem className="text-destructive" onClick={onRemove}>
                  Remove Column
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div ref={contentRef} className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        {isLoading
          ? // Show skeleton loaders while loading
            Array.from({ length: 5 }).map((_, i) => <NewsCardSkeleton key={i} />)
          : // Show actual news items
            column.items.map((item, index) => (
              <NewsCard
                key={item.id}
                item={item}
                style={{
                  animationDelay: `${index * 50}ms`,
                  opacity: 0,
                  animation: "card-fade-in 0.3s ease forwards",
                }}
              />
            ))}
      </div>

      {/* Add some global styles for animations */}
      <style jsx global>{`
        @keyframes card-fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(155, 155, 155, 0.5);
          border-radius: 20px;
        }
      `}</style>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark, Pin, ChevronDown, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { NewsItem } from "@/components/news/news-dashboard"

interface NewsCardProps {
  item: NewsItem
  style?: React.CSSProperties
}

export function NewsCard({ item, style }: NewsCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [imageError, setImageError] = useState(false)

  // Sample tenant list - in a real app, this would come from your data source
  const tenants = [
    "Acme Corp",
    "Globex",
    "Initech",
    "Massive Dynamic",
    "Stark Industries",
    "Wayne Enterprises",
    "Umbrella Corporation",
  ]

  return (
    <div className="rounded-md border bg-card overflow-hidden hover:shadow-md transition-shadow" style={style}>
      <div className="p-3 space-y-2">
        <div className="flex justify-between items-start gap-2">
          {item.image && (
            <div className="flex-shrink-0">
              <img
                src={item.image || "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop&crop=center"}
                alt={item.title}
                className="w-[80px] h-[60px] object-cover rounded-md bg-muted"
                onError={(e) => {
                  if (!imageError) {
                    setImageError(true)
                    e.currentTarget.src = "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop&crop=center"
                  }
                }}
              />
            </div>
          )}

          <div className={cn("flex-1", !item.image && "w-full")}>
            <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.snippet}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{item.source}</span>
            <span>•</span>
            <span>{item.date}</span>
          </div>

          <div className="flex gap-1">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t px-1 py-1 flex items-center justify-between bg-muted/30">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => setIsSaved(!isSaved)}
          >
            <Bookmark className={cn("h-4 w-4", isSaved && "fill-current text-primary")} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => setIsPinned(!isPinned)}
          >
            <Pin className={cn("h-4 w-4", isPinned && "fill-current text-primary")} />
          </Button>
        </div>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
              >
                {selectedTenant ? (
                  <>
                    <span>Added to {selectedTenant}</span>
                    <ChevronDown className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    <span>+ Add to</span>
                    <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tenants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 px-3 py-1 text-xs rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-xs font-medium text-muted-foreground" disabled>
                  Add to tenant profile
                </DropdownMenuItem>
                {tenants
                  .filter((tenant) => tenant.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((tenant) => (
                    <DropdownMenuItem key={tenant} className="text-xs" onClick={() => setSelectedTenant(tenant)}>
                      <span className="flex-1">{tenant}</span>
                      {selectedTenant === tenant && <Check className="h-3 w-3 ml-2" />}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

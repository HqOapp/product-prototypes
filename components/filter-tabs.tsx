"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Filter } from "lucide-react"
import { useState } from "react"

type FilterTabsProps = {
  tabs: {
    id: string
    label: string
  }[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  className?: string
}

export function FilterTabs({ tabs, activeTab, onTabChange, className }: FilterTabsProps) {
  const [active, setActive] = useState(activeTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActive(tabId)
    if (onTabChange) {
      onTabChange(tabId)
    }
  }

  return (
    <div className={cn("flex items-center space-x-1 rounded-md bg-muted p-1", className)}>
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={active === tab.id ? "default" : "ghost"}
          size="sm"
          onClick={() => handleTabChange(tab.id)}
          className={cn(
            "text-sm",
            active === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
          )}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  )
}

type FilterDropdownProps = {
  label: string
  icon?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function FilterDropdown({ label, icon, className, children }: FilterDropdownProps) {
  if (children) {
    return children
  }
  
  return (
    <Button variant="outline" size="sm" className={cn("flex items-center gap-2", className)}>
      {icon || <Filter className="h-4 w-4" />}
      {label}
    </Button>
  )
}

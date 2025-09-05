"use client"

import type React from "react"

import { ArrowDown, ArrowUp, BarChart2, Lightbulb, Zap, CheckSquare, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type InsightCardProps = {
  icon: "insight" | "recommendation" | "automation" | "task"
  title: string
  value?: string | React.ReactNode
  comparison?: {
    value: string
    direction: "up" | "down" | "neutral"
    label: string
  }
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "ghost"
    color?: string
  }
  className?: string
}

export function InsightCardNew({ icon, title, value, comparison, description, action, className }: InsightCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "insight":
        return <BarChart2 className="h-5 w-5 text-blue-500" />
      case "recommendation":
        return <Lightbulb className="h-5 w-5 text-purple-500" />
      case "automation":
        return <Zap className="h-5 w-5 text-amber-500" />
      case "task":
        return <CheckSquare className="h-5 w-5 text-gray-700" />
      default:
        return <BarChart2 className="h-5 w-5 text-blue-500" />
    }
  }

  const getActionColor = () => {
    if (action?.color) return action.color

    switch (icon) {
      case "insight":
        return "bg-blue-50 text-blue-600 hover:bg-blue-100"
      case "recommendation":
        return "bg-purple-50 text-purple-600 hover:bg-purple-100"
      case "automation":
        return "bg-amber-50 text-amber-600 hover:bg-amber-100"
      case "task":
        return "bg-gray-50 text-gray-700 hover:bg-gray-100"
      default:
        return "bg-blue-50 text-blue-600 hover:bg-blue-100"
    }
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="text-sm font-medium text-muted-foreground">
            {icon.charAt(0).toUpperCase() + icon.slice(1)}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <h3 className="text-lg font-medium">{title}</h3>

        {value && <div className="text-3xl font-bold">{value}</div>}

        {comparison && (
          <div className="flex items-center text-sm">
            {comparison.direction === "up" ? (
              <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
            ) : comparison.direction === "down" ? (
              <ArrowDown className="mr-1 h-4 w-4 text-rose-500" />
            ) : null}
            <span
              className={cn(
                comparison.direction === "up" && "text-emerald-500",
                comparison.direction === "down" && "text-rose-500",
              )}
            >
              {comparison.value}
            </span>
            <span className="ml-1 text-muted-foreground">{comparison.label}</span>
          </div>
        )}

        {description && <p className="text-sm text-muted-foreground">{description}</p>}

        {action && (
          <Button
            variant={action.variant || "outline"}
            onClick={action.onClick}
            className={cn("w-full mt-4", action.variant !== "default" && getActionColor())}
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

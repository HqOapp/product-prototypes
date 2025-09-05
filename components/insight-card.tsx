"use client"

import { Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type InsightCardProps = {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  severity?: "info" | "warning" | "success"
}

export function InsightCard({ title, description, action, severity = "info" }: InsightCardProps) {
  const severityColors = {
    info: "bg-blue-50 border-blue-200",
    warning: "bg-amber-50 border-amber-200",
    success: "bg-emerald-50 border-emerald-200",
  }

  const iconColors = {
    info: "text-blue-500",
    warning: "text-amber-500",
    success: "text-emerald-500",
  }

  return (
    <Card className={`border ${severityColors[severity]}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Lightbulb className={`h-5 w-5 ${iconColors[severity]}`} />
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      {action && (
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" onClick={action.onClick} className="w-full">
            {action.label}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

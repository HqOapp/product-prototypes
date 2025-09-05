"use client"

import { CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

type TaskCardProps = {
  title: string
  description: string
  type: "task" | "automation"
  onAction: () => void
}

export function TaskCard({ title, description, type, onAction }: TaskCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {type === "task" ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <Clock className="h-5 w-5 text-primary" />
          )}
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter className="pt-0">
        {type === "task" ? (
          <Button variant="default" size="sm" onClick={onAction} className="w-full">
            Complete Task
          </Button>
        ) : (
          <div className="flex w-full items-center justify-between">
            <span className="text-sm">Enable Automation</span>
            <Switch onCheckedChange={onAction} />
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

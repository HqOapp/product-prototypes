import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { InfoIcon } from "lucide-react"

type MetricCardProps = {
  title: string
  infoTooltip?: string
  viewLink?: string
  className?: string
  children: React.ReactNode
}

export function MetricCardNew({ title, infoTooltip, viewLink, className, children }: MetricCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-1">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {infoTooltip && <InfoIcon className="h-4 w-4 text-muted-foreground" />}
        </div>
        {viewLink && (
          <Link href={viewLink} className="text-sm text-primary hover:underline">
            View
          </Link>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

type MetricValueProps = {
  value: string | number
  label: string
  variant?: "blue" | "green" | "orange" | "purple"
  className?: string
}

export function MetricValue({ value, label, variant = "blue", className }: MetricValueProps) {
  // Define color styles directly instead of using custom classes
  const getColorStyles = () => {
    switch (variant) {
      case "blue":
        return "bg-blue-50 text-blue-600"
      case "green":
        return "bg-green-50 text-green-600"
      case "orange":
        return "bg-orange-50 text-orange-600"
      case "purple":
        return "bg-purple-50 text-purple-600"
      default:
        return "bg-blue-50 text-blue-600"
    }
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={cn("rounded-md p-3 text-center", getColorStyles())}>
        <div className="text-xl font-semibold">{value}</div>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

type MetricGroupProps = {
  mainValue: string | number
  mainLabel: string
  metrics: {
    value: string | number
    label: string
    variant: "blue" | "green" | "orange" | "purple"
  }[]
  className?: string
}

export function MetricGroup({ mainValue, mainLabel, metrics, className }: MetricGroupProps) {
  return (
    <div className={cn("", className)}>
      <div className="mb-4">
        <div className="text-4xl font-bold">{mainValue}</div>
        <div className="text-sm text-muted-foreground">{mainLabel}</div>
      </div>
      <div className="flex gap-2">
        {metrics.map((metric, index) => (
          <MetricValue key={index} value={metric.value} label={metric.label} variant={metric.variant} />
        ))}
      </div>
    </div>
  )
}

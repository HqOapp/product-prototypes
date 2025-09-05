import type React from "react"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type MetricCardProps = {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  className?: string
}

export function MetricCard({ title, value, change, changeLabel, icon, className }: MetricCardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <Card
      className={cn(
        "border-l-4",
        isPositive ? "border-l-emerald-500" : isNegative ? "border-l-rose-500" : "border-l-blue-500",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className="flex items-center text-xs text-muted-foreground mt-1">
            {isPositive && <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />}
            {isNegative && <ArrowDown className="mr-1 h-4 w-4 text-rose-500" />}
            <span className={cn(isPositive && "text-emerald-500", isNegative && "text-rose-500")}>
              {isPositive && "+"}
              {change}%
            </span>
            {changeLabel && <span className="ml-1">{changeLabel}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

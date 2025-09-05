import {
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell as RechartsCell,
  ResponsiveContainer as RechartsResponsiveContainer,
  Legend as RechartsLegend,
  Tooltip as RechartsTooltip,
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  CartesianGrid as RechartsCartesianGrid,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  LineChart as RechartsLineChart,
  Line as RechartsLine,
} from "recharts"
import type React from "react"

export const PieChart = RechartsPieChart
export const Pie = RechartsPie
export const Cell = RechartsCell
export const ResponsiveContainer = RechartsResponsiveContainer
export const Legend = RechartsLegend
export const Tooltip = RechartsTooltip
export const Bar = RechartsBar
export const BarChart = RechartsBarChart
export const CartesianGrid = RechartsCartesianGrid
export const XAxis = RechartsXAxis
export const YAxis = RechartsYAxis
export const Line = RechartsLine
export const LineChart = RechartsLineChart

type ChartContainerProps = {
  children: React.ReactNode
  config?: Record<string, { label: string; color: string }>
  className?: string
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ children, config, className = "" }) => {
  return (
    <div
      className={`chart-container w-full ${className}`}
      style={
        {
          "--color-foreground": "hsl(var(--foreground))",
          ...(config &&
            Object.fromEntries(Object.entries(config).map(([key, value]) => [`--color-${key}`, value.color]))),
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}

type ChartTooltipContentProps = {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
  }>
  label?: string
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-2">
        {label && (
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
          </div>
        )}
        {payload.map((entry) => (
          <div key={entry.name} className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground" style={{ color: entry.color }}>
              {entry.name}
            </span>
            <span className="font-bold">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

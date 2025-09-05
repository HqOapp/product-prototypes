"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type HeatmapData = {
  day: string
  hour: string
  value: number
}

type HeatmapChartProps = {
  data: HeatmapData[]
  title: string
  className?: string
  colorScale?: "blue" | "green" | "purple"
}

export function HeatmapChart({ data, title, className, colorScale = "blue" }: HeatmapChartProps) {
  const [hoveredCell, setHoveredCell] = useState<HeatmapData | null>(null)

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`)

  // Find min and max values for color scaling
  const values = data.map((d) => d.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)

  // Function to get color based on value and selected color scale
  const getColor = (value: number) => {
    const normalizedValue = (value - minValue) / (maxValue - minValue)

    if (colorScale === "blue") {
      return `rgba(59, 130, 246, ${normalizedValue.toFixed(2)})`
    } else if (colorScale === "green") {
      return `rgba(16, 185, 129, ${normalizedValue.toFixed(2)})`
    } else if (colorScale === "purple") {
      return `rgba(139, 92, 246, ${normalizedValue.toFixed(2)})`
    }

    return `rgba(59, 130, 246, ${normalizedValue.toFixed(2)})`
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Hours (columns) */}
          <div className="flex mb-2 pl-10">
            {hours.map((hour) => (
              <div key={hour} className="flex-1 text-xs text-center text-muted-foreground">
                {hour}
              </div>
            ))}
          </div>

          {/* Days (rows) with heatmap cells */}
          {days.map((day) => (
            <div key={day} className="flex items-center mb-1">
              <div className="w-10 text-xs font-medium">{day}</div>
              {hours.map((hour) => {
                const cellData = data.find((d) => d.day === day && d.hour === hour) || { day, hour, value: 0 }

                return (
                  <div
                    key={`${day}-${hour}`}
                    className="flex-1 aspect-square m-0.5 rounded cursor-pointer relative"
                    style={{
                      backgroundColor: getColor(cellData.value),
                    }}
                    onMouseEnter={() => setHoveredCell(cellData)}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                )
              })}
            </div>
          ))}

          {/* Tooltip */}
          {hoveredCell && (
            <div className="absolute top-0 left-0 bg-background border rounded-md shadow-md p-2 text-xs z-10 transform -translate-y-full">
              <div className="font-medium">
                {hoveredCell.day}, {hoveredCell.hour}
              </div>
              <div>Value: {hoveredCell.value}</div>
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center justify-end mt-4">
            <div className="flex items-center text-xs text-muted-foreground">
              <span>Low</span>
              <div className="flex mx-1">
                <div className="w-4 h-4" style={{ backgroundColor: getColor(minValue) }}></div>
                <div className="w-4 h-4" style={{ backgroundColor: getColor((minValue + maxValue) * 0.25) }}></div>
                <div className="w-4 h-4" style={{ backgroundColor: getColor((minValue + maxValue) * 0.5) }}></div>
                <div className="w-4 h-4" style={{ backgroundColor: getColor((minValue + maxValue) * 0.75) }}></div>
                <div className="w-4 h-4" style={{ backgroundColor: getColor(maxValue) }}></div>
              </div>
              <span>High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

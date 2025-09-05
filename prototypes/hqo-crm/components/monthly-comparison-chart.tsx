"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type MonthlyData = {
  month: string
  value: number
  previousYearValue?: number
}

type MonthlyComparisonChartProps = {
  data: MonthlyData[]
  title: string
  className?: string
  valueLabel?: string
  previousYearLabel?: string
}

export function MonthlyComparisonChart({
  data,
  title,
  className,
  valueLabel = "Current Year",
  previousYearLabel = "Previous Year",
}: MonthlyComparisonChartProps) {
  const maxValue = Math.max(
    ...data.map((d) => d.value),
    ...data.filter((d) => d.previousYearValue !== undefined).map((d) => d.previousYearValue!),
  )

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.month} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-xs font-medium">{item.month}</div>
                <div className="text-xs text-muted-foreground">{item.value.toFixed(1)}</div>
              </div>

              <div className="relative h-6 bg-gray-100 rounded-sm">
                {/* Current Year Bar */}
                <div
                  className="absolute top-0 h-3 bg-blue-500 rounded-sm"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                  }}
                ></div>

                {/* Previous Year Bar (if available) */}
                {item.previousYearValue !== undefined && (
                  <div
                    className="absolute bottom-0 h-3 bg-gray-400 rounded-sm"
                    style={{
                      width: `${(item.previousYearValue / maxValue) * 100}%`,
                    }}
                  ></div>
                )}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-end space-x-4 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 mr-1"></div>
              <span className="text-xs">{valueLabel}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-400 mr-1"></div>
              <span className="text-xs">{previousYearLabel}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

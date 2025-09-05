"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type SleepData = {
  day: string
  date: number
  sleepHours: number
  sleepNeed: number
  rem: number
  deep: number
}

type SleepChartProps = {
  data: SleepData[]
  title: string
  className?: string
}

export function SleepChart({ data, title, className }: SleepChartProps) {
  // Sort data by date
  const sortedData = [...data].sort((a, b) => a.date - b.date)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <div>0:00</div>
            <div>2:00</div>
            <div>4:00</div>
            <div>6:00</div>
            <div>8:00</div>
            <div>10:00</div>
          </div>

          {sortedData.map((item) => (
            <div key={item.day + item.date} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="text-xs font-medium w-10">
                  {item.day} {item.date}
                </div>
                <div className="flex-1 relative h-6">
                  {/* Sleep Need Bar */}
                  <div
                    className="absolute top-0 h-6 bg-gray-100 rounded-sm"
                    style={{
                      width: `${(item.sleepNeed / 10) * 100}%`,
                    }}
                  ></div>

                  {/* Sleep Hours Bar */}
                  <div
                    className="absolute top-0 h-6 bg-blue-200 rounded-sm"
                    style={{
                      width: `${(item.sleepHours / 10) * 100}%`,
                    }}
                  ></div>

                  {/* Deep Sleep Bar */}
                  <div
                    className="absolute top-0 h-3 bg-blue-600 rounded-sm"
                    style={{
                      width: `${(item.deep / 10) * 100}%`,
                    }}
                  ></div>

                  {/* REM Sleep Bar */}
                  <div
                    className="absolute bottom-0 h-3 bg-purple-500 rounded-sm"
                    style={{
                      width: `${(item.rem / 10) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-end space-x-4 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-100 mr-1"></div>
              <span className="text-xs">Sleep Need</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-200 mr-1"></div>
              <span className="text-xs">Hours of Sleep</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 mr-1"></div>
              <span className="text-xs">Deep</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 mr-1"></div>
              <span className="text-xs">REM</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

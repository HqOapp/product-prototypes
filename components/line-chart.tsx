"use client"

import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "@/components/ui/chart"

type LineChartProps = {
  data: any[]
  lines: {
    dataKey: string
    name: string
    color: string
    strokeWidth?: number
    strokeDasharray?: string
  }[]
  xAxisDataKey: string
  height?: number
  className?: string
}

export function LineChartComponent({ data, lines, xAxisDataKey, height = 300, className }: LineChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey={xAxisDataKey}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
            dy={10}
          />
          <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} dx={-10} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
                      </div>
                      {payload.map((entry) => (
                        <div key={entry.name} className="flex flex-col">
                          <span
                            className="text-[0.70rem] uppercase text-muted-foreground"
                            style={{ color: entry.color }}
                          >
                            {entry.name}
                          </span>
                          <span className="font-bold">{entry.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ paddingBottom: "10px" }}
          />
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 2}
              strokeDasharray={line.strokeDasharray}
              dot={{ r: 4, strokeWidth: 1 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

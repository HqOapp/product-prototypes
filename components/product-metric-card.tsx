import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type ProductMetricCardProps = {
  title: string
  description: string
  value: string | number
  secondaryMetric?: {
    label: string
    value: string
  }
  progressPercentage?: number
  progressColor?: string
}

export function ProductMetricCard({
  title,
  description,
  value,
  secondaryMetric,
  progressPercentage = 70,
  progressColor = "#00A67E",
}: ProductMetricCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold">{value}</span>
        </div>

        {progressPercentage !== undefined && (
          <div className="h-4 w-full rounded-full bg-gray-200">
            <div
              className="h-4 rounded-full"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: progressColor,
              }}
            />
          </div>
        )}

        {secondaryMetric && (
          <div className="pt-2">
            <p className="text-lg font-medium">{secondaryMetric.label}</p>
            <p className="text-sm text-muted-foreground">{secondaryMetric.value}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

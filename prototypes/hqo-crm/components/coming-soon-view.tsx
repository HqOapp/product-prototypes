"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

export function ComingSoonView() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
      <Card className="w-96 text-center">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <Clock className="h-12 w-12 text-blue-500" />
            <h2 className="text-2xl font-semibold text-gray-900">Coming Soon</h2>
            <p className="text-gray-500">This persona view is under development.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
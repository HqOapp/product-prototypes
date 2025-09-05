"use client"

import { cn } from "@/lib/utils"
import { Info } from "lucide-react"

interface AlertBannerProps {
  title: string
  description: string
  className?: string
}

export function AlertBanner({ title, description, className }: AlertBannerProps) {
  return (
    <div className={cn("mt-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-sm rounded-lg px-6 py-4 flex items-start space-x-4", className)}>
      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <Info className="h-5 w-5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-blue-900 mb-1">{title}</h3>
        <p className="text-sm text-blue-700 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}




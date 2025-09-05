"use client"

import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigation } from "@/lib/navigation-context"

export function NavigationRestoreButton() {
  const { isNavigationHidden, showNavigation } = useNavigation()

  if (!isNavigationHidden) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={showNavigation}
        size="sm"
        className="shadow-lg hover:shadow-xl transition-shadow bg-blue-600 hover:bg-blue-700"
      >
        <Eye className="h-4 w-4 mr-2" />
        Show navigation
      </Button>
    </div>
  )
} 
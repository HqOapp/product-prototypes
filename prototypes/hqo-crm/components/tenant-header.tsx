import { Button } from "@/components/ui/button"
import { ChevronLeft, Edit } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TenantHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback className="bg-green-100 text-green-700">EV</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">EcoVolt Energy Solutions</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Cobblestone Collaborative</span>
                <span>•</span>
                <span>Floor 9, Floor 8 - Suite 901, Suite 801</span>
              </div>
            </div>
          </div>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
    </div>
  )
}

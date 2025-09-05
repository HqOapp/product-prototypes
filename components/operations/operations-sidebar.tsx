"use client"

import { 
  Shield,
  Smartphone,
  Users,
  Calendar,
  Wrench
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useNavigation } from "@/lib/navigation-context"

export function OperationsSidebar() {
  const pathname = usePathname()
  const { isNavigationHidden } = useNavigation()

  const operationsNavItems = [
    {
      title: "Access Control",
      icon: Shield,
      href: "/operations/access-control",
      active: pathname === "/operations/access-control",
    },
    {
      title: "Mobile Access",
      icon: Smartphone,
      href: "/operations/mobile-access",
      active: pathname === "/operations/mobile-access",
    },
    {
      title: "Visitor Management",
      icon: Users,
      href: "/operations/visitor-management",
      active: pathname === "/operations/visitor-management",
    },
    {
      title: "Resource Booking",
      icon: Calendar,
      href: "/operations/resource-booking",
      active: pathname === "/operations/resource-booking",
    },
    {
      title: "Work Orders",
      icon: Wrench,
      href: "/operations/work-orders",
      active: pathname === "/operations/work-orders",
    },
  ]

  if (isNavigationHidden) {
    return null
  }

  return (
    <div className="border-r bg-white w-64">
      <div className="flex h-full flex-col">
        <nav className="flex-1 space-y-1 p-4 pt-6">
          {/* Navigation Items */}
          <div className="mb-6">
            <div className="space-y-1">
              {operationsNavItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
} 
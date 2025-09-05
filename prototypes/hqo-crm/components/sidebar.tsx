"use client"

import { LayoutGrid, Building2, Users, Grid3X3, User, Users2, CreditCard, FileText, TrendingUp, Store, Briefcase, MapPin } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useNavigation } from "@/lib/navigation-context"

interface SidebarProps {
  navigation?: Array<{
    name: string
    href: string
    icon: any
  }>
}

export function Sidebar({ navigation: customNavigation }: SidebarProps = {}) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { isNavigationHidden } = useNavigation()

  const defaultNavigation = [
    { name: "My HqO", href: "/", icon: LayoutGrid },
    { name: "Buildings", href: "/buildings", icon: Building2 },
    { name: "Tenants", href: "/tenants", icon: Briefcase },
    { name: "Tours", href: "/tours", icon: MapPin },
    { name: "Leases", href: "/leases", icon: FileText },
    { name: "Merchants", href: "/merchants", icon: Store },
    { name: "Vendors", href: "/vendors", icon: Grid3X3 },
    { name: "People", href: "/people", icon: User },
    { name: "Audiences", href: "/audiences", icon: Users2 },
    { name: "Payments", href: "/payments", icon: CreditCard },
    { name: "Documents", href: "/documents", icon: FileText },
  ]

  const navigation = customNavigation || defaultNavigation

  if (isNavigationHidden) {
    return null
  }

  return (
    <div
      className={cn(
        "flex h-screen flex-col bg-background border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header with collapse button */}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isCurrent = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group relative flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors",
                  isCurrent
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {/* Active indicator */}
                {isCurrent && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />}

                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isCollapsed ? "mx-auto" : "mr-3",
                    isCurrent ? "text-primary" : "text-muted-foreground",
                  )}
                />

                {!isCollapsed && (
                  <span className={cn("truncate", isCurrent ? "text-primary" : "text-muted-foreground")}>
                    {item.name}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

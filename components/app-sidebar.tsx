"use client"

import { BarChart3, Building2, LayoutDashboard, Sparkles, Newspaper, RefreshCw } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useNavigation } from "@/lib/navigation-context"
import { createHqoCrmRoute } from "@/lib/hqo-crm-routes"

export function AppSidebar() {
  const pathname = usePathname()
  const { isNavigationHidden } = useNavigation()

  const mainNavItems = [
    {
      title: "Overview",
      icon: LayoutDashboard,
      href: createHqoCrmRoute("/intelligence"),
      active: pathname === createHqoCrmRoute("/intelligence"),
    },
    {
      title: "Product Analytics",
      icon: BarChart3,
      href: createHqoCrmRoute("/intelligence/product-analytics"),
      active: pathname === createHqoCrmRoute("/intelligence/product-analytics"),
    },
    {
      title: "Tenant Sentiment",
      icon: Sparkles,
      href: createHqoCrmRoute("/intelligence/tenant-sentiment"),
      active: pathname === createHqoCrmRoute("/intelligence/tenant-sentiment"),
    },
    {
      title: "Renewals",
      icon: RefreshCw,
      href: createHqoCrmRoute("/intelligence/renewals"),
      active: pathname === createHqoCrmRoute("/intelligence/renewals"),
    },
    {
      title: "Assessments",
      icon: Building2,
      href: createHqoCrmRoute("/intelligence/assessments"),
      active: pathname === createHqoCrmRoute("/intelligence/assessments"),
    },
    {
      title: "News",
      icon: Newspaper,
      href: createHqoCrmRoute("/intelligence/news"),
      active: pathname === createHqoCrmRoute("/intelligence/news"),
    },
  ]

  if (isNavigationHidden) {
    return null
  }

  return (
    <div className="border-r bg-white w-64">
      <div className="flex h-full flex-col">
        <nav className="flex-1 space-y-1 p-4 pt-6">
          {mainNavItems.map((item) => (
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
        </nav>
      </div>
    </div>
  )
}

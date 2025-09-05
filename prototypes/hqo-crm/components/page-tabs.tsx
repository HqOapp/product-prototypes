"use client"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import Link from "next/link"

type PageTabsProps = {
  tabs: {
    label: string
    href: string
  }[]
  className?: string
}

export function PageTabs({ tabs, className }: PageTabsProps) {
  const pathname = usePathname()

  return (
    <div className={cn("border-b", className)}>
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={cn(
              "py-4 text-sm font-medium transition-colors relative",
              pathname === tab.href
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

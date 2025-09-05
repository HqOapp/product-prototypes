"use client"

import { Settings, Database, Layout, Users, Monitor } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

const adminNavigation = [
  { name: "Object Configuration", href: "/admin", icon: Database },
  { name: "Attribute Library", href: "/admin/attributes", icon: Settings },
  { name: "Page Templates", href: "/admin/templates", icon: Layout },
  { name: "Tenant Lifecycle", href: "/admin/tenant-settings", icon: Users },
  { name: "Mode", href: "/admin/mode", icon: Monitor },
]

export function AdminSidebar() {
  return <Sidebar navigation={adminNavigation} />
}

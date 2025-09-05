"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HelpCircle, Settings } from "lucide-react"
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"
import { UserSelector } from "@/components/user-selector"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { useNavigation } from "@/lib/navigation-context"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Experience Manager", href: "/experience" },
  { name: "Operations", href: "/operations" },
  { name: "Intelligence", href: "/intelligence" },
]

export function TopNav() {
  const pathname = usePathname()
  const { isNavigationHidden, toggleNavigation } = useNavigation()
  const { currentMode } = useCustomerMode()

  if (isNavigationHidden) {
    return null
  }

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-6">
        {/* Logo and Navigation */}
        <div className="flex items-center">
          <Image 
            src="/red-hqo-logo.svg" 
            alt="HqO Logo" 
            width={120} 
            height={48}
            className="h-12 w-auto"
          />
          <nav className="flex items-center space-x-8 ml-10">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative px-1 py-2 text-sm font-medium transition-colors hover:text-gray-900",
                    isActive ? "text-blue-600" : "text-gray-600",
                  )}
                >
                  {item.name}
                  {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Help */}
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </Button>

          {/* Settings */}
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>

          {/* Mode-aware User Selector */}
          <UserSelector mode={currentMode} />
        </div>
      </div>
    </header>
  )
}

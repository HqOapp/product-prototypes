"use client"

import { HelpCircle, Settings, User, LogOut, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { createHqoCrmRoute } from "@/lib/hqo-crm-routes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useNavigation } from "@/lib/navigation-context"

export function AppHeader() {
  const pathname = usePathname()
  const { isNavigationHidden, toggleNavigation } = useNavigation()

  const mainNavItems = [
    {
      title: "Home",
      href: "/home",
      active: pathname === "/home",
    },
    {
      title: "Experience Manager",
      href: "/experience-manager",
      active: pathname === "/experience-manager",
    },
    {
      title: "Intelligence",
      href: "/",
      active: true, // Always active across all pages in this project
    },
  ]

  if (isNavigationHidden) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-6">
          <Link href={createHqoCrmRoute("/")} className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#ff4438]">HqO</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 h-full">
            {mainNavItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center h-16 leading-none",
                  item.active ? "text-primary border-b-2 border-primary relative" : "text-muted-foreground",
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="border-l h-6 mx-2"></div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/abstract-profile.png" alt="User" />
                  <AvatarFallback>ES</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">Ellie Sanders</p>
                  <p className="text-xs text-muted-foreground">Garbarino Properties</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Ellie Sanders</p>
                  <p className="text-xs text-muted-foreground">Garbarino Properties</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="flex items-center justify-between px-2 py-2">
                <div className="flex items-center space-x-2">
                  {isNavigationHidden ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">Hide navigation</span>
                </div>
                <Switch
                  checked={isNavigationHidden}
                  onCheckedChange={toggleNavigation}
                />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

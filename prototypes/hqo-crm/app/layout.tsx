import type React from "react"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.css"
import { TopNav } from "@/components/top-nav"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { NavigationProvider } from "@/lib/navigation-context"
import { NavigationRestoreButton } from "@/components/navigation-restore-button"
import { CustomerModeProvider } from "@/lib/providers/customer-mode-provider"
import { PersonaProvider } from "@/lib/providers/persona-provider"
import { UserProvider } from "@/lib/providers/user-provider"
import { Toaster } from "@/components/ui/toaster"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
})

export const metadata: Metadata = {
  title: "Commercial Real Estate CRM",
  description: "Purpose-built CRM for commercial real estate management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${roboto.className} ${roboto.variable}`}>
        <CustomerModeProvider>
          <PersonaProvider>
            <UserProvider>
              <NavigationProvider>
                <TopNav />
                <NavigationRestoreButton />
                <TooltipProvider>
                  {children}
                </TooltipProvider>
                <Toaster />
              </NavigationProvider>
            </UserProvider>
          </PersonaProvider>
        </CustomerModeProvider>
      </body>
    </html>
  )
}

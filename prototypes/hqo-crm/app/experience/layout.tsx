"use client"

import React from "react"
import { ExperienceSidebar } from "@/components/experience/experience-sidebar"

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <ExperienceSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}



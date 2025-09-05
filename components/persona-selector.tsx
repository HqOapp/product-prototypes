"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePersona, type Persona } from "@/lib/providers/persona-provider"
import { User, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const personas: Persona[] = [
  "Property Experience Manager (PXM)",
  "Executive", 
  "Asset Manager",
  "Investment Officer",
  "Finance Controller"
]

export function PersonaSelector() {
  const { currentPersona, setPersona } = usePersona()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 h-10">
          <User className="h-4 w-4" />
          {currentPersona}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {personas.map((persona) => (
          <DropdownMenuItem
            key={persona}
            onClick={() => {
              console.log('Clicking persona:', persona)
              setPersona(persona)
            }}
            className={cn(
              "cursor-pointer",
              currentPersona === persona && "bg-accent"
            )}
          >
            {persona}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 
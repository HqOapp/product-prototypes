"use client"

import { useState } from "react"
import { CalendarIcon, ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

type FilterBarProps = {
  className?: string
}

export function FilterBar({ className }: FilterBarProps) {
  const [date, setDate] = useState<{
    from: Date
    to: Date
  }>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  })

  const [property, setProperty] = useState("All Properties")
  const [platform, setPlatform] = useState("All Platforms")
  const [userType, setUserType] = useState("All Users")

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date.from}
            selected={date}
            onSelect={(newDate) => {
              if (newDate?.from && newDate?.to) {
                setDate(newDate)
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-normal">
            <Filter className="mr-2 h-4 w-4" />
            {property}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Properties</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setProperty("All Properties")}>All Properties</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setProperty("One Post Office")}>One Post Office</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setProperty("Two Liberty")}>Two Liberty</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setProperty("Three Commerce")}>Three Commerce</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-normal">
            <Filter className="mr-2 h-4 w-4" />
            {platform}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Platforms</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setPlatform("All Platforms")}>All Platforms</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPlatform("Web")}>Web</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPlatform("Mobile")}>Mobile</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-normal">
            <Filter className="mr-2 h-4 w-4" />
            {userType}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>User Types</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setUserType("All Users")}>All Users</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUserType("Residents")}>Residents</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUserType("Visitors")}>Visitors</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

"use client"

import { useState, useRef } from "react"
import { NewsColumn } from "@/components/news/news-column"
import { AddColumnDialog } from "@/components/news/add-column-dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

// Types for our news items and columns
export type NewsItem = {
  id: string
  title: string
  snippet: string
  date: string
  source: string
  tags: string[]
  image?: string
}

export type Column = {
  id: string
  title: string
  type: "predefined" | "custom"
  keywords?: string[]
  filters?: {
    tenants?: string[]
    buildings?: string[]
    regions?: string[]
  }
  items: NewsItem[]
}

export function NewsDashboard() {
  // State for columns
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "tenant-news",
      title: "News about your tenants",
      type: "predefined",
      items: generateMockNewsItems("tenant", 8),
    },
    {
      id: "industry-news",
      title: "Industry news",
      type: "predefined",
      items: generateMockNewsItems("industry", 12),
    },
    {
      id: "asset-news",
      title: "News about your assets",
      type: "predefined",
      items: generateMockNewsItems("asset", 10),
    },
  ])

  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Function to add a new column
  const addColumn = (newColumn: Omit<Column, "id" | "items">) => {
    if (columns.length >= 6) {
      // Maximum 6 columns allowed
      return
    }

    // Convert title to sentence case
    const formattedTitle = newColumn.title.charAt(0).toUpperCase() + newColumn.title.slice(1).toLowerCase()

    const id = `custom-${Date.now()}`
    setColumns([
      ...columns,
      {
        ...newColumn,
        title: formattedTitle,
        id,
        items: generateMockNewsItems("custom", 6, newColumn.keywords),
      },
    ])

    // Scroll to the new column after it's added
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          left: containerRef.current.scrollWidth,
          behavior: "smooth",
        })
      }
    }, 100)
  }

  // Function to remove a column
  const removeColumn = (columnId: string) => {
    setColumns(columns.filter((col) => col.id !== columnId))
  }

  // Function to refresh a column
  const refreshColumn = (columnId: string) => {
    setColumns(
      columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            items: generateMockNewsItems(
              col.type === "predefined" ? col.id.split("-")[0] : "custom",
              col.items.length,
              col.keywords,
            ),
          }
        }
        return col
      }),
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory pb-4 px-4"
      style={{ scrollbarWidth: "thin" }}
    >
      {columns.map((column) => (
        <div key={column.id} className="snap-start flex-shrink-0 px-2 first:pl-4 last:pr-4">
          <NewsColumn
            column={column}
            onRemove={column.type === "custom" ? () => removeColumn(column.id) : undefined}
            onRefresh={() => refreshColumn(column.id)}
          />
        </div>
      ))}

      {columns.length < 6 && (
        <div className="snap-start flex-shrink-0 w-[350px] px-2 flex items-start pt-4">
          <Button
            onClick={() => setIsAddColumnOpen(true)}
            variant="outline"
            className="h-[120px] w-full border-dashed flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
          >
            <PlusCircle className="h-8 w-8" />
            <span>Add Column</span>
          </Button>
        </div>
      )}

      <AddColumnDialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen} onAdd={addColumn} />
    </div>
  )
}

// Helper function to generate mock news items
function generateMockNewsItems(type: string, count: number, keywords?: string[]): NewsItem[] {
  const sources = [
    "Bloomberg",
    "Wall Street Journal",
    "Financial Times",
    "Reuters",
    "CNBC",
    "Commercial Observer",
    "Bisnow",
    "The Real Deal",
  ]

  const tenantNames = [
    "Acme Corp",
    "Globex",
    "Initech",
    "Massive Dynamic",
    "Stark Industries",
    "Wayne Enterprises",
    "Umbrella Corporation",
  ]

  const buildingNames = [
    "One Liberty Plaza",
    "Empire State Building",
    "Chrysler Building",
    "Willis Tower",
    "Transamerica Pyramid",
    "Salesforce Tower",
  ]

  const industryTopics = [
    "Office Market",
    "Retail Trends",
    "Industrial Real Estate",
    "PropTech",
    "ESG Compliance",
    "Smart Buildings",
    "Urban Planning",
  ]

  // Define Unsplash image URLs for each category
  const tenantImages = [
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=faces", // Business meeting
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center", // Office space
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face", // Business person
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop&crop=faces", // Diverse team
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=300&fit=crop&crop=center", // Conference room
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop&crop=faces", // Office workers
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop&crop=faces", // Business meeting
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=faces", // Office collaboration
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop&crop=center", // Office interior
  ]

  const assetImages = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&crop=center", // Modern skyscraper
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop&crop=center", // Office building exterior
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center", // Commercial building
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop&crop=center", // Modern architecture
    "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=400&h=300&fit=crop&crop=center", // Glass building
    "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=300&fit=crop&crop=center", // Contemporary office
    "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400&h=300&fit=crop&crop=center", // Financial district
    "https://images.unsplash.com/photo-1590725175722-5d0d5b5e1963?w=400&h=300&fit=crop&crop=center", // Modern office building
  ]

  const industryImages = [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center", // Real estate market
    "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=400&h=300&fit=crop&crop=center", // Construction
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=center", // Urban planning
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop&crop=center", // Smart building tech
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop&crop=center", // Business analytics
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center", // Retail space
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&crop=center", // Commercial construction
    "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop&crop=center", // Real estate technology
  ]

  const getTitle = () => {
    if (type === "tenant") {
      const tenant = tenantNames[Math.floor(Math.random() * tenantNames.length)]
      return `${tenant} ${
        [
          "Announces New Headquarters",
          "Reports Strong Q2 Growth",
          "Expands Office Space",
          "Signs Major Lease",
          "Implements Hybrid Work Policy",
        ][Math.floor(Math.random() * 5)]
      }`
    } else if (type === "asset") {
      const building = buildingNames[Math.floor(Math.random() * buildingNames.length)]
      return `${building} ${
        [
          "Achieves LEED Certification",
          "Undergoes Major Renovation",
          "Reaches Full Occupancy",
          "Sells for Record Price",
          "Implements New Security System",
        ][Math.floor(Math.random() * 5)]
      }`
    } else if (type === "industry") {
      const topic = industryTopics[Math.floor(Math.random() * industryTopics.length)]
      return `${
        [
          "New Study Shows Trends in",
          "Experts Predict Changes for",
          "Market Report Highlights",
          "Investors Focus on",
          "Regulatory Changes Impact",
        ][Math.floor(Math.random() * 5)]
      } ${topic}`
    } else if (type === "custom" && keywords && keywords.length > 0) {
      const keyword = keywords[Math.floor(Math.random() * keywords.length)]
      return `${
        ["Breaking News:", "Latest Update:", "Market Alert:", "Trending Now:", "Just In:"][
          Math.floor(Math.random() * 5)
        ]
      } ${keyword} ${
        [
          "Shows Promising Growth",
          "Faces New Challenges",
          "Exceeds Expectations",
          "Announces Major Changes",
          "Draws Investor Attention",
        ][Math.floor(Math.random() * 5)]
      }`
    }

    return "News Item Title"
  }

  return Array.from({ length: count }).map((_, i) => {
    const title = getTitle()
    const source = sources[Math.floor(Math.random() * sources.length)]

    // Generate a date within the last 7 days
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 7))

    // Format date as "MMM D" or "Today" or "Yesterday"
    let formattedDate
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      formattedDate = `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      formattedDate = `Yesterday, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else {
      formattedDate = `${date.toLocaleDateString([], { month: "short", day: "numeric" })}, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    }

    // Select an appropriate image based on the news type
    let image
    if (type === "tenant") {
      image = tenantImages[i % tenantImages.length]
    } else if (type === "asset") {
      image = assetImages[i % assetImages.length]
    } else if (type === "industry") {
      image = industryImages[i % industryImages.length]
    } else if (type === "custom" && keywords && keywords.length > 0) {
      // For custom columns, use a mix of all images
      const allImages = [...tenantImages, ...assetImages]
      image = allImages[Math.floor(Math.random() * allImages.length)]
    } else {
      // Fallback - general business news image
      image = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop&crop=center"
    }

    return {
      id: `news-${type}-${i}`,
      title,
      snippet: `This is a brief summary of the news article about ${title.toLowerCase()}. The article discusses important developments and potential impacts.`,
      date: formattedDate,
      source,
      tags:
        type === "tenant"
          ? ["tenant", tenantNames[Math.floor(Math.random() * tenantNames.length)].split(" ")[0].toLowerCase()]
          : type === "asset"
            ? ["property", buildingNames[Math.floor(Math.random() * buildingNames.length)].split(" ")[0].toLowerCase()]
            : [
                "industry",
                industryTopics[Math.floor(Math.random() * industryTopics.length)].split(" ")[0].toLowerCase(),
              ],
      image,
    }
  })
}

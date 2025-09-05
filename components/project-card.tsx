"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ExternalLink, MoreVertical, ThumbsUp } from "lucide-react"
import { ProductBadge } from "./product-badge"
import type { Project } from "@/lib/data"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface ProjectCardProps {
  project: Project
  onDelete?: (id: string) => void
  onUpvote: (id: string) => void
  upvotes: Record<string, number>
}

export function ProjectCard({ project, onDelete, onUpvote, upvotes }: ProjectCardProps) {
  const needsLink = project.link === "#"
  const isNewIdea = project.id.startsWith("idea-")
  const currentUpvotes = upvotes[project.id] || 0

  const handleUpvote = () => {
    onUpvote(project.id)
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-white h-full flex flex-col">
      <CardHeader className="pb-2 relative">
        <h2 className="text-xl font-medium text-[#2D3338]">{project.title}</h2>
        {needsLink ? (
          <div className={`absolute top-4 ${onDelete ? "right-14" : "right-4"}`}>
            <span
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium ${isNewIdea ? "bg-amber-500" : "bg-[#044AEF]"} text-white rounded`}
            >
              {isNewIdea ? "Pending" : "Needs link"}
            </span>
          </div>
        ) : (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute top-4 ${onDelete ? "right-14" : "right-4"} text-gray-400 hover:text-[#044AEF] transition-all duration-200`}
            aria-label={`Open ${project.title} in new tab`}
          >
            <ExternalLink
              size={18}
              className="transition-all duration-200 hover:text-[#044AEF] hover:rotate-12 hover:scale-110"
            />
          </a>
        )}

        {onDelete && (
          <div className="absolute top-4 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => onDelete(project.id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-4 flex-grow">
        <p className="text-[#696E72] text-sm leading-tight mb-6">{project.description}</p>
      </CardContent>

      <div className="relative px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="overflow-x-auto pr-24">
            <div className="flex gap-2 items-center min-w-max">
              {project.products.map((product) => (
                <ProductBadge key={product} product={product} />
              ))}
            </div>
          </div>

          <div className="absolute right-4 z-10">
            <div className="pl-4 pr-1 py-1 bg-white border-l border-gray-200">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 bg-white hover:bg-gray-50 border-gray-200"
                onClick={handleUpvote}
              >
                <ThumbsUp
                  className={`h-3.5 w-3.5 ${currentUpvotes > 0 ? "fill-[#044AEF] text-[#044AEF]" : "text-gray-500"}`}
                />
                <span className={`text-xs font-medium ${currentUpvotes > 0 ? "text-[#044AEF]" : "text-gray-500"}`}>
                  {currentUpvotes > 0 ? currentUpvotes : "Upvote"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

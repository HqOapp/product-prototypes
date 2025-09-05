"use client"

import { useState, useMemo, useEffect } from "react"
import { ProjectCard } from "@/components/project-card"
import { projects as initialProjects, type Project } from "@/lib/data"
import { SearchFilter } from "@/components/search-filter"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AddIdeaModal } from "@/components/add-idea-modal"
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/components/footer"

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isAddIdeaModalOpen, setIsAddIdeaModalOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [upvotes, setUpvotes] = useState<Record<string, number>>({})
  const { toast } = useToast()

  // Load upvotes from localStorage on initial render
  useEffect(() => {
    const savedUpvotes = localStorage.getItem("projectUpvotes")
    if (savedUpvotes) {
      try {
        setUpvotes(JSON.parse(savedUpvotes))
      } catch (e) {
        console.error("Failed to parse saved upvotes")
      }
    }
  }, [])

  // Save upvotes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("projectUpvotes", JSON.stringify(upvotes))
  }, [upvotes])

  // Get only the product categories that are actually used in projects
  const usedProductCategories = useMemo(() => {
    const productSet = new Set<string>()

    projects.forEach((project) => {
      project.products.forEach((product) => {
        productSet.add(product)
      })
    })

    return Array.from(productSet).sort()
  }, [projects])

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Filter by search term
      const matchesSearch =
        searchTerm === "" ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by selected products - project must have ALL selected tags
      const matchesProducts =
        selectedProducts.length === 0 || selectedProducts.every((product) => project.products.includes(product))

      return matchesSearch && matchesProducts
    })
  }, [searchTerm, selectedProducts, projects])

  const handleAddIdea = (newIdea: Project) => {
    setProjects((prev) => [...prev, newIdea])
    toast({
      title: "Idea added",
      description: "Your idea has been added to the showcase.",
    })
  }

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id))
    toast({
      title: "Project deleted",
      description: "The project has been removed from the showcase.",
    })
  }

  const handleUpvote = (id: string) => {
    setUpvotes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }))
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-12">
            <header className="flex flex-col">
              <div className="mb-4 w-[60px]">
                {/* Inline SVG for reliable rendering */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84.59 40.084" aria-label="HqO Logo">
                  <g transform="translate(0 0)">
                    <path
                      d="M903.106,625.449a4.553,4.553,0,0,1-.858,1.263,3.726,3.726,0,0,1-1.266.849,4.066,4.066,0,0,1-1.556.308,4.149,4.149,0,0,1-1.588-.308,3.887,3.887,0,0,1-1.266-.849,3.951,3.951,0,0,1-.837-1.263,4.025,4.025,0,0,1-.311-1.571,3.588,3.588,0,0,1,.322-1.507,4.722,4.722,0,0,1,.859-1.231,3.732,3.732,0,0,1,1.266-.849,4.089,4.089,0,0,1,3.112,0,3.892,3.892,0,0,1,1.266.849,4.285,4.285,0,0,1,.858,1.252,3.6,3.6,0,0,1,.322,1.518,3.773,3.773,0,0,1-.322,1.539m5.614-10.719h-5.292v2.451a6.516,6.516,0,0,0-5.365-2.462l-10.9.011V602.154h-8.917V614.73H864.917V602.154H856v31h8.917V621.915h13.316l.011,11.239h8.917V621.915H889.4a10.093,10.093,0,0,0-.2,2.069,9.624,9.624,0,0,0,.665,3.566,8.988,8.988,0,0,0,1.846,2.919,8.6,8.6,0,0,0,2.79,1.963,8.466,8.466,0,0,0,3.487.711,7.252,7.252,0,0,0,5.44-2.228V640.9h6.234V615.662a.937.937,0,0,0-.942-.932"
                      transform="translate(-856 -600.819)"
                      fill="#fd4539"
                    />
                    <path
                      d="M1054.181,622.469a8.213,8.213,0,1,1,8.3-8.212,8.258,8.258,0,0,1-8.3,8.212m0-25.048a17.007,17.007,0,0,0-16.276,11.894h2.266a2.134,2.134,0,0,1,2.144,2.12v14.888a16.927,16.927,0,1,0,11.867-28.9"
                      transform="translate(-986.614 -597.421)"
                      fill="#fd4539"
                    />
                  </g>
                </svg>
              </div>
              <h1 className="text-3xl font-normal text-[#696E72]">What's next</h1>
            </header>

            <Button onClick={() => setIsAddIdeaModalOpen(true)} className="bg-[#044AEF] hover:bg-[#0339c7]">
              <PlusCircle className="mr-1 h-4 w-4" />
              Add idea
            </Button>
          </div>

          <SearchFilter
            onSearchChange={setSearchTerm}
            onProductFilterChange={setSelectedProducts}
            usedProductCategories={usedProductCategories}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={project.id.startsWith("idea-") ? handleDeleteProject : undefined}
                onUpvote={handleUpvote}
                upvotes={upvotes}
              />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#696E72]">No projects match your search criteria.</p>
            </div>
          )}
        </div>

        <AddIdeaModal
          isOpen={isAddIdeaModalOpen}
          onClose={() => setIsAddIdeaModalOpen(false)}
          onAddIdea={handleAddIdea}
          usedProductCategories={usedProductCategories}
        />
      </main>
      <Footer />
    </>
  )
}

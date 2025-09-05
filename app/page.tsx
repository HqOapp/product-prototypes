"use client"

import { useState, useMemo, useEffect } from "react"
import { ProjectCard } from "@/components/project-card"
import { MainPrototypeCard } from "@/components/main-prototype-card"
import { type Project, type Prototype, prototypeToProject } from "@/lib/data"
import { SearchFilter } from "@/components/search-filter"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/components/footer"

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [prototypes, setPrototypes] = useState<Prototype[]>([])
  const [mainPrototype, setMainPrototype] = useState<Prototype | null>(null)
  const [upvotes, setUpvotes] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
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

  // Fetch prototypes from API on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        
        // Fetch both regular prototypes and main prototype in parallel
        const [prototypesResponse, mainPrototypeResponse] = await Promise.all([
          fetch('/api/prototypes'),
          fetch('/api/main-prototype')
        ])
        
        if (!prototypesResponse.ok) {
          throw new Error('Failed to fetch prototypes')
        }
        
        const fetchedPrototypes: Prototype[] = await prototypesResponse.json()
        setPrototypes(fetchedPrototypes)
        
        // Convert prototypes to projects for backward compatibility
        const convertedProjects = fetchedPrototypes.map(prototypeToProject)
        setProjects(convertedProjects)
        
        // Handle main prototype (might be null if it doesn't exist)
        if (mainPrototypeResponse.ok) {
          const fetchedMainPrototype: Prototype | null = await mainPrototypeResponse.json()
          setMainPrototype(fetchedMainPrototype)
        }
        
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: "Error",
          description: "Failed to load prototypes. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get only the product categories that are actually used in projects and main prototype
  const usedProductCategories = useMemo(() => {
    const productSet = new Set<string>()

    // Add products from regular projects
    projects.forEach((project) => {
      project.products.forEach((product) => {
        productSet.add(product)
      })
    })

    // Add products from main prototype
    if (mainPrototype) {
      mainPrototype.products.forEach((product) => {
        productSet.add(product)
      })
    }

    return Array.from(productSet).sort()
  }, [projects, mainPrototype])

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

  // Filter main prototype based on search criteria
  const shouldShowMainPrototype = useMemo(() => {
    if (!mainPrototype) return false

    // Filter by search term
    const matchesSearch =
      searchTerm === "" ||
      mainPrototype.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mainPrototype.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mainPrototype.heroDescription && mainPrototype.heroDescription.toLowerCase().includes(searchTerm.toLowerCase()))

    // Filter by selected products - prototype must have ALL selected tags
    const matchesProducts =
      selectedProducts.length === 0 || selectedProducts.every((product) => mainPrototype.products.includes(product))

    return matchesSearch && matchesProducts
  }, [searchTerm, selectedProducts, mainPrototype])

  const handleOpenIdeaLink = () => {
    window.open('https://ventureapp.atlassian.net/jira/polaris/projects/RDMP/ideas/view/7993191', '_blank')
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
          <div className="flex justify-between items-start mb-8">
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

            <Button onClick={handleOpenIdeaLink} className="bg-[#044AEF] hover:bg-[#0339c7]">
              <PlusCircle className="mr-1 h-4 w-4" />
              Add idea
            </Button>
          </div>

          <SearchFilter
            onSearchChange={setSearchTerm}
            onProductFilterChange={setSelectedProducts}
            usedProductCategories={usedProductCategories}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* Main Prototype Card - appears first in grid */}
                {shouldShowMainPrototype && mainPrototype && (
                  <MainPrototypeCard
                    key={mainPrototype.id}
                    prototype={mainPrototype}
                    onUpvote={handleUpvote}
                    upvotes={upvotes}
                  />
                )}
                
                {/* Regular prototype cards */}
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

              {filteredProjects.length === 0 && !shouldShowMainPrototype && (
                <div className="text-center py-12">
                  <p className="text-[#696E72]">No prototypes match your search criteria.</p>
                </div>
              )}
            </>
          )}
        </div>

      </main>
      <Footer />
    </>
  )
}

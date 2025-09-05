'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

interface Prototype {
  id: string
  name: string
  description: string
  products: string[]
  status: string
  type: string
  author: string
  created: string
  updated: string
  tags: string[]
  link: string
  repository: string
  screenshot: string
  priority: string
  callToAction?: string
  heroDescription?: string
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function PrototypePage({ params }: PageProps) {
  const [prototype, setPrototype] = useState<Prototype | null>(null)
  const [loading, setLoading] = useState(true)
  const [prototypeId, setPrototypeId] = useState<string>('')

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params
      setPrototypeId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!prototypeId) return

    async function fetchPrototype() {
      try {
        // First try to get from regular prototypes
        const response = await fetch('/api/prototypes')
        const prototypes = await response.json()
        
        let foundPrototype = prototypes.find((p: Prototype) => p.id === prototypeId)
        
        // If not found in regular prototypes, check main prototype
        if (!foundPrototype && prototypeId === 'main-prototype') {
          const mainResponse = await fetch('/api/main-prototype')
          if (mainResponse.ok) {
            foundPrototype = await mainResponse.json()
            foundPrototype.id = 'main-prototype'
          }
        }

        if (!foundPrototype) {
          notFound()
          return
        }

        setPrototype(foundPrototype)
      } catch (error) {
        console.error('Failed to fetch prototype:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchPrototype()
  }, [prototypeId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#044AEF] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading prototype...</p>
        </div>
      </div>
    )
  }

  if (!prototype) {
    return notFound()
  }

  // Handle different prototype types
  const renderPrototypeContent = () => {
    switch (prototype.type) {
      case 'code':
        // For code prototypes that are integrated into the main app, redirect directly
        if (prototype.id === 'hqo-crm') {
          // Redirect to the integrated HqO CRM
          if (typeof window !== 'undefined') {
            window.location.href = '/prototypes/hqo-crm'
            return null
          }
          
          // Server-side redirect
          return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#044AEF] mx-auto"></div>
                <p className="mt-4 text-gray-600">Redirecting to {prototype.name}...</p>
              </div>
            </div>
          )
        }
        
        // For other prototypes, you can implement iframe embedding or other approaches
        return (
          <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{prototype.name}</h1>
                  <p className="text-xl text-gray-600">{prototype.description}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-600 mb-8">
                    This prototype is not yet integrated. You can find the source code in the prototypes/{prototype.id} folder.
                  </p>
                  <a
                    href="/"
                    className="inline-flex items-center px-6 py-3 bg-[#044AEF] text-white rounded-md shadow-sm text-base font-medium hover:bg-[#0339c7]"
                  >
                    Back to Dashboard
                  </a>
                </div>
              </div>
            </div>
          </div>
        )

      case 'main':
        // For main prototype, show information page
        return (
          <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{prototype.name}</h1>
                  <p className="text-xl text-gray-600">{prototype.heroDescription || prototype.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Details</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Author</dt>
                        <dd className="text-sm text-gray-900">{prototype.author}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="text-sm text-gray-900 capitalize">{prototype.status}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Created</dt>
                        <dd className="text-sm text-gray-900">{prototype.created}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Products</h3>
                    <div className="flex flex-wrap gap-2">
                      {prototype.products.map((product) => (
                        <span
                          key={product}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#044AEF] text-white"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <a
                    href="/"
                    className="inline-flex items-center px-6 py-3 bg-[#044AEF] text-white rounded-md shadow-sm text-base font-medium hover:bg-[#0339c7]"
                  >
                    Back to Dashboard
                  </a>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">{prototype.name}</h1>
              <p className="text-gray-600 mb-8">{prototype.description}</p>
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 bg-[#044AEF] text-white rounded-md shadow-sm text-base font-medium hover:bg-[#0339c7]"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        )
    }
  }

  return renderPrototypeContent()
}

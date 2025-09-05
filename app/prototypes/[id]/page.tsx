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
        // For code prototypes, determine the URL based on environment
        const prototypePort = prototype.id === 'hqo-crm' ? '3001' : '3002'
        const isProduction = process.env.NODE_ENV === 'production'
        const isDevelopment = !isProduction
        
        // In development, use localhost. In production, check for deployed prototype URLs
        let prototypeUrl: string
        if (isDevelopment) {
          prototypeUrl = `http://localhost:${prototypePort}`
        } else {
          // Production URLs - these should be set as environment variables or hardcoded for specific prototypes
          switch (prototype.id) {
            case 'hqo-crm':
              prototypeUrl = process.env.NEXT_PUBLIC_HQO_CRM_URL || 'https://hqo-crm.vercel.app'
              break
            default:
              prototypeUrl = `https://${prototype.id}.vercel.app`
          }
        }
        
        return (
          <div className="h-screen w-full">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{prototype.name}</h1>
                  <p className="text-gray-600 mt-1">{prototype.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href={prototypeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Open in New Tab
                  </a>
                  <a
                    href="/"
                    className="inline-flex items-center px-4 py-2 bg-[#044AEF] text-white rounded-md shadow-sm text-sm font-medium hover:bg-[#0339c7]"
                  >
                    Back to Dashboard
                  </a>
                </div>
              </div>
            </div>
            
            <div className="relative h-[calc(100vh-100px)]">
              <iframe
                src={prototypeUrl}
                className="w-full h-full border-0"
                title={prototype.name}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                onLoad={() => {
                  // Hide overlay when iframe loads successfully
                  const overlay = document.getElementById('prototype-overlay')
                  if (overlay) {
                    overlay.style.display = 'none'
                  }
                }}
                onError={() => {
                  // Show overlay on error
                  const overlay = document.getElementById('prototype-overlay')
                  if (overlay) {
                    overlay.style.display = 'flex'
                  }
                }}
              />
              
              {/* Overlay for when prototype isn't running */}
              <div 
                className="absolute inset-0 bg-gray-100 flex items-center justify-center"
                id="prototype-overlay"
                style={{ display: 'flex' }}
              >
                <div className="text-center max-w-md">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isDevelopment ? 'Loading Prototype...' : 'Loading Deployed Prototype...'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {isDevelopment 
                      ? `Starting the ${prototype.name} prototype on port ${prototypePort}.`
                      : `Loading ${prototype.name} from deployment: ${prototypeUrl}`
                    }
                  </p>
                  {isDevelopment && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
                      <p className="text-sm font-medium text-gray-900 mb-2">If this takes too long, ensure the prototype is running:</p>
                      <code className="text-xs text-gray-600 block">
                        cd prototypes/{prototype.id}<br/>
                        npm run dev
                      </code>
                    </div>
                  )}
                  {!isDevelopment && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                      <p className="text-sm font-medium text-blue-900 mb-2">Production Deployment:</p>
                      <p className="text-xs text-blue-700">
                        If the prototype doesn't load, it may need to be deployed separately to: {prototypeUrl}
                      </p>
                    </div>
                  )}
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

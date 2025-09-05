import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export interface Prototype {
  id: string
  name: string
  description: string
  products: string[]
  status: 'draft' | 'in-progress' | 'completed' | 'archived'
  type: 'design' | 'code' | 'research' | 'poc' | 'main'
  author: string
  created: string
  updated: string
  tags: string[]
  link: string
  repository: string
  screenshot: string
  priority: 'low' | 'medium' | 'high'
  isMainPrototype?: boolean
  callToAction?: string
  heroDescription?: string
}

export async function GET() {
  try {
    const prototypesDir = path.join(process.cwd(), 'prototypes')
    
    // Check if prototypes directory exists
    if (!fs.existsSync(prototypesDir)) {
      return NextResponse.json([])
    }

    const prototypes: Prototype[] = []
    const prototypeFolders = fs.readdirSync(prototypesDir, { withFileTypes: true })

    for (const folder of prototypeFolders) {
      if (folder.isDirectory()) {
        // Skip main-prototype folder as it's handled separately
        if (folder.name === 'main-prototype') {
          continue
        }
        
        const prototypeJsonPath = path.join(prototypesDir, folder.name, 'prototype.json')
        
        if (fs.existsSync(prototypeJsonPath)) {
          try {
            const prototypeData = JSON.parse(
              fs.readFileSync(prototypeJsonPath, 'utf-8')
            )
            
            // Skip if this is marked as main prototype but not in main-prototype folder
            if (prototypeData.isMainPrototype && folder.name !== 'main-prototype') {
              continue
            }
            
            // Add the folder name as ID and screenshot path
            const prototype: Prototype = {
              id: folder.name,
              ...prototypeData,
              screenshot: `/api/prototypes/${folder.name}/screenshot`
            }
            
            prototypes.push(prototype)
          } catch (error) {
            console.warn(`Failed to parse prototype.json for ${folder.name}:`, error)
          }
        }
      }
    }

    // Sort by priority (high -> medium -> low) and then by updated date
    prototypes.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      
      if (priorityDiff !== 0) {
        return priorityDiff
      }
      
      return new Date(b.updated).getTime() - new Date(a.updated).getTime()
    })

    return NextResponse.json(prototypes)
  } catch (error) {
    console.error('Error reading prototypes:', error)
    return NextResponse.json(
      { error: 'Failed to read prototypes' },
      { status: 500 }
    )
  }
}

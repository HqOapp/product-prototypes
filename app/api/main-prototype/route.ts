import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import type { Prototype } from '../prototypes/route'

export async function GET() {
  try {
    const mainPrototypeDir = path.join(process.cwd(), 'prototypes', 'main-prototype')
    const prototypeJsonPath = path.join(mainPrototypeDir, 'prototype.json')
    
    // Check if main prototype exists
    if (!fs.existsSync(prototypeJsonPath)) {
      return NextResponse.json(null)
    }

    try {
      const prototypeData = JSON.parse(
        fs.readFileSync(prototypeJsonPath, 'utf-8')
      )
      
      // Add the folder name as ID and screenshot path
      const prototype: Prototype = {
        id: 'main-prototype',
        ...prototypeData,
        screenshot: `/api/prototypes/main-prototype/screenshot`
      }
      
      return NextResponse.json(prototype)
    } catch (error) {
      console.warn('Failed to parse main prototype.json:', error)
      return NextResponse.json(null)
    }
  } catch (error) {
    console.error('Error reading main prototype:', error)
    return NextResponse.json(
      { error: 'Failed to read main prototype' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const prototypesDir = path.join(process.cwd(), 'prototypes')
    const prototypeDir = path.join(prototypesDir, id)
    
    // Check if prototype directory exists
    if (!fs.existsSync(prototypeDir)) {
      return new NextResponse('Prototype not found', { status: 404 })
    }

    // Read prototype.json to get the screenshot filename
    const prototypeJsonPath = path.join(prototypeDir, 'prototype.json')
    if (!fs.existsSync(prototypeJsonPath)) {
      return new NextResponse('Prototype metadata not found', { status: 404 })
    }

    const prototypeData = JSON.parse(fs.readFileSync(prototypeJsonPath, 'utf-8'))
    const screenshotFilename = prototypeData.screenshot

    // Find the screenshot file
    const screenshotPath = path.join(prototypeDir, screenshotFilename)
    
    if (!fs.existsSync(screenshotPath)) {
      return new NextResponse('Screenshot not found', { status: 404 })
    }

    // Read the file
    const imageBuffer = fs.readFileSync(screenshotPath)
    
    // Determine content type based on file extension
    const ext = path.extname(screenshotFilename).toLowerCase()
    let contentType = 'image/jpeg' // default
    
    switch (ext) {
      case '.png':
        contentType = 'image/png'
        break
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg'
        break
      case '.gif':
        contentType = 'image/gif'
        break
      case '.webp':
        contentType = 'image/webp'
        break
      case '.svg':
        contentType = 'image/svg+xml'
        break
    }

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving screenshot:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

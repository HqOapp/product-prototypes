import { ImageResponse } from "next/og"
import { FaviconSvg } from "@/components/favicon-svg"

// Route segment config
export const runtime = "edge"

// Image metadata
export const size = {
  width: 32,
  height: 32,
}

// Image generation
export default function Icon() {
  return new ImageResponse(<FaviconSvg />, { ...size })
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Edit2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface InlineEditProps {
  value: string
  onSave: (value: string) => void
  type?: "text" | "textarea"
  placeholder?: string
  className?: string
  displayClassName?: string
  multiline?: boolean
  maxLength?: number
}

export function InlineEdit({ 
  value, 
  onSave, 
  type = "text",
  placeholder,
  className,
  displayClassName,
  multiline = false,
  maxLength
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isHovered, setIsHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      // Select all text when entering edit mode
      if ('select' in inputRef.current) {
        inputRef.current.select()
      }
    }
  }, [isEditing])

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onSave(editValue.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const InputComponent = multiline || type === "textarea" ? Textarea : Input

  if (isEditing) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex-1">
          <InputComponent
            ref={inputRef as any}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            className="text-sm"
            rows={multiline ? 3 : undefined}
          />
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group relative cursor-pointer transition-all duration-200 rounded px-1 -mx-1",
        "hover:bg-gray-50 hover:shadow-sm",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsEditing(true)}
    >
      <div className={cn("flex items-center justify-between", displayClassName)}>
        <span className="flex-1">
          {value || placeholder}
        </span>
        <Edit2 
          className={cn(
            "h-4 w-4 text-gray-400 transition-opacity duration-200 ml-2",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    </div>
  )
}

interface InlineImageEditProps {
  src: string
  alt: string
  onUpload: (file: File) => void
  className?: string
  fallback?: React.ReactNode
}

export function InlineImageEdit({ 
  src, 
  alt, 
  onUpload, 
  className, 
  fallback 
}: InlineImageEditProps) {
  const [isHovered, setIsHovered] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className={cn(
        "group relative cursor-pointer transition-all duration-200 rounded",
        "hover:ring-2 hover:ring-blue-200 hover:ring-offset-2",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        fallback
      )}
      
      <div className={cn(
        "absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-200 rounded",
        isHovered ? "opacity-100" : "opacity-0"
      )}>
        <Edit2 className="h-5 w-5 text-white" />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
} 
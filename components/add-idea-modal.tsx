"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Project } from "@/lib/data"

interface AddIdeaModalProps {
  isOpen: boolean
  onClose: () => void
  onAddIdea: (idea: Project) => void
  usedProductCategories: string[]
}

export function AddIdeaModal({ isOpen, onClose, onAddIdea, usedProductCategories }: AddIdeaModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || selectedProducts.length === 0) return

    const newIdea: Project = {
      id: `idea-${Date.now()}`,
      title,
      description,
      products: selectedProducts,
      link: "#",
    }

    onAddIdea(newIdea)
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setSelectedProducts([])
  }

  const handleProductToggle = (product: string) => {
    setSelectedProducts((prev) => (prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product]))
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Add new idea</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project idea"
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Products (select at least one)</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {usedProductCategories.map((product) => (
                <Button
                  key={product}
                  type="button"
                  variant={selectedProducts.includes(product) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleProductToggle(product)}
                  className="text-xs"
                >
                  {product}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title || !description || selectedProducts.length === 0}>
              Add idea
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

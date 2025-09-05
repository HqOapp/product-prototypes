"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
// Sidebar is now provided by app/experience/layout.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, X, Plus, Info } from "lucide-react"
import Link from "next/link"

export default function CreateProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productType = searchParams.get('type') || ''
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: productType,
    vendor: "",
    price: "",
    comparePrice: "",
    costPerItem: "",
    status: "draft",
    isPhysicalProduct: false,
    trackQuantity: false,
    quantity: "",
    weight: "",
    tags: [] as string[],
    images: [] as string[]
  })

  const [newTag, setNewTag] = useState("")

  const productTypes = [
    { value: "space", label: "Space" },
    { value: "resource", label: "Resource" },
    { value: "event", label: "Event" },
    { value: "service", label: "Service" },
    { value: "food-beverage", label: "Food & Beverage" },
    { value: "membership", label: "Membership" },
    { value: "class", label: "Class" },
    { value: "other", label: "Other" }
  ]

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = () => {
    // TODO: Implement save logic
    console.log("Saving offering:", formData)
    router.push('/experience/offerings')
  }

  const getTypeDisplayName = (type: string) => {
    return productTypes.find(t => t.value === type)?.label || type
  }

  return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/experience/offerings">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Offerings
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Add offering</h1>
                {productType && (
                  <p className="text-sm text-gray-600 mt-1">
                    Creating a new {getTypeDisplayName(productType).toLowerCase()} offering
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">Discard</Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title" className="text-sm font-medium">
                          Title
                        </Label>
                        <Input
                          id="title"
                          placeholder="Short sleeve t-shirt"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-sm font-medium">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Enter offering description..."
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          className="mt-1 min-h-[120px]"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Provide details about your offering that will help customers understand what you're offering.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Media */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Media</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">
                          Upload new
                        </Button>
                        <Button variant="ghost" size="sm">
                          Select existing
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Accepts images, videos, or 3D models
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price" className="text-sm font-medium">
                          Price
                        </Label>
                        <div className="relative mt-1">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="price"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="comparePrice" className="text-sm font-medium">
                          Compare-at price
                        </Label>
                        <div className="relative mt-1">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="comparePrice"
                            placeholder="0.00"
                            value={formData.comparePrice}
                            onChange={(e) => handleInputChange('comparePrice', e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="charge-tax"
                          checked={false}
                          onCheckedChange={() => {}}
                        />
                        <Label htmlFor="charge-tax" className="text-sm">
                          Charge tax on this offering
                        </Label>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 my-4"></div>
                    <div>
                      <Label htmlFor="costPerItem" className="text-sm font-medium">
                        Cost per item
                      </Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="costPerItem"
                          placeholder="0.00"
                          value={formData.costPerItem}
                          onChange={(e) => handleInputChange('costPerItem', e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Inventory */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Inventory</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="track-quantity"
                          checked={formData.trackQuantity}
                          onCheckedChange={(checked) => handleInputChange('trackQuantity', checked)}
                        />
                        <Label htmlFor="track-quantity" className="text-sm">
                          Track quantity
                        </Label>
                      </div>
                      
                      {formData.trackQuantity && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="quantity" className="text-sm font-medium">
                              Quantity
                            </Label>
                            <Input
                              id="quantity"
                              placeholder="0"
                              value={formData.quantity}
                              onChange={(e) => handleInputChange('quantity', e.target.value)}
                              className="mt-1 max-w-xs"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="continue-selling"
                              checked={false}
                              onCheckedChange={() => {}}
                            />
                            <Label htmlFor="continue-selling" className="text-sm">
                              Continue selling when out of stock
                            </Label>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Shipping</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="physical-product"
                          checked={formData.isPhysicalProduct}
                          onCheckedChange={(checked) => handleInputChange('isPhysicalProduct', checked)}
                        />
                        <Label htmlFor="physical-product" className="text-sm">
                          This is a physical offering
                        </Label>
                      </div>
                      
                      {formData.isPhysicalProduct && (
                        <div>
                          <Label htmlFor="weight" className="text-sm font-medium">
                            Weight
                          </Label>
                          <div className="flex mt-1 max-w-xs">
                            <Input
                              id="weight"
                              placeholder="0.0"
                              value={formData.weight}
                              onChange={(e) => handleInputChange('weight', e.target.value)}
                              className="rounded-r-none"
                            />
                            <Select defaultValue="lb">
                              <SelectTrigger className="w-20 rounded-l-none border-l-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="lb">lb</SelectItem>
                                <SelectItem value="kg">kg</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Status</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Offering Organization */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      Offering organization
                      <Info className="h-4 w-4 ml-2 text-gray-400" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-4">
                    <div>
                      <Label htmlFor="type" className="text-sm font-medium">
                        Type
                      </Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => handleInputChange('type', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          {productTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="vendor" className="text-sm font-medium">
                        Vendor
                      </Label>
                      <Input
                        id="vendor"
                        placeholder="Enter vendor name"
                        value={formData.vendor}
                        onChange={(e) => handleInputChange('vendor', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Tags</Label>
                      <div className="mt-1">
                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {formData.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 ml-2"
                                  onClick={() => removeTag(tag)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addTag()}
                            className="flex-1"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={addTag}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
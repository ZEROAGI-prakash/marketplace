"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, FileUp, Loader2, CheckCircle2, AlertCircle, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function NewProductPage() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "OTHER",
    tags: "",
    isFree: true,
    price: "0",
  })

  const [modelFile, setModelFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-generate slug from name
    if (field === "name") {
      const slug = value.toString().toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'model' | 'image') => {
    const file = e.target.files?.[0]
    if (file) {
      if (type === 'model') {
        setModelFile(file)
      } else {
        setImageFile(file)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Create FormData
      const data = new FormData()
      data.append('name', formData.name)
      data.append('slug', formData.slug)
      data.append('description', formData.description)
      data.append('category', formData.category)
      data.append('tags', formData.tags)
      data.append('isFree', formData.isFree.toString())
      data.append('price', formData.price)
      
      if (modelFile) data.append('modelFile', modelFile)
      if (imageFile) data.append('imageFile', imageFile)

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: data,
      })

      clearInterval(interval)
      setUploadProgress(100)

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      setUploadSuccess(true)
      setTimeout(() => {
        router.push('/admin/products')
      }, 2000)

    } catch (err) {
      setError('Failed to upload product. Please try again.')
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/products">
          <Button variant="ghost" className="mb-4 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
              Upload New 3D Model
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Add a new product to your marketplace catalog
            </p>
          </div>
          <Badge className="bg-black dark:bg-white text-white dark:text-black text-lg px-4 py-2">
            Premium Upload
          </Badge>
        </div>
      </div>

      {/* Success Message */}
      {uploadSuccess && (
        <Card className="mb-6 border-2 border-green-500 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">Upload Successful!</h3>
                <p className="text-sm text-green-700 dark:text-green-300">Redirecting to products page...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="mb-6 border-2 border-red-500 bg-red-50 dark:bg-red-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">Upload Failed</h3>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Card className="mb-6 border-2 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="bg-white dark:bg-zinc-950 border-b-2 border-zinc-200 dark:border-zinc-800">
            <CardTitle className="text-xl text-zinc-900 dark:text-white">Basic Information</CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">Essential details about your 3D model</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6 bg-zinc-50 dark:bg-zinc-900">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Articulated Dragon"
                required
                className="bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-base font-semibold">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="articulated-dragon"
                required
                className="bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white"
              />
              <p className="text-xs text-zinc-500">Auto-generated from product name</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Detailed description of your 3D model..."
                rows={5}
                required
                className="bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-semibold">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CHARACTERS">Characters</SelectItem>
                    <SelectItem value="ENVIRONMENTS">Environments</SelectItem>
                    <SelectItem value="PROPS">Props</SelectItem>
                    <SelectItem value="ARCHITECTURE">Architecture</SelectItem>
                    <SelectItem value="VEHICLES">Vehicles</SelectItem>
                    <SelectItem value="ABSTRACT">Abstract</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-base font-semibold">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  placeholder="dragon, articulated, flexible, toys"
                  className="bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="mb-6 border-2 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="bg-white dark:bg-zinc-950 border-b-2 border-zinc-200 dark:border-zinc-800">
            <CardTitle className="text-xl text-zinc-900 dark:text-white">Pricing</CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">Set the price for your model</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4 bg-zinc-50 dark:bg-zinc-900">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="isFree"
                checked={formData.isFree}
                onCheckedChange={(checked) => {
                  handleInputChange("isFree", checked as boolean)
                  if (checked) handleInputChange("price", "0")
                }}
                className="border-2 border-zinc-300 dark:border-zinc-700"
              />
              <Label htmlFor="isFree" className="text-base font-semibold cursor-pointer">
                Free Product
              </Label>
            </div>

            {!formData.isFree && (
              <div className="space-y-2">
                <Label htmlFor="price" className="text-base font-semibold">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="24.99"
                  required={!formData.isFree}
                  className="bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Files */}
        <Card className="mb-6 border-2 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="bg-white dark:bg-zinc-950 border-b-2 border-zinc-200 dark:border-zinc-800">
            <CardTitle className="text-xl text-zinc-900 dark:text-white">Files</CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">Upload your 3D model and preview image</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6 bg-zinc-50 dark:bg-zinc-900">
            {/* 3D Model File */}
            <div className="space-y-3">
              <Label htmlFor="modelFile" className="text-base font-semibold">Upload 3D Model File *</Label>
              <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-8 text-center bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <input
                  id="modelFile"
                  type="file"
                  accept=".stl,.obj,.fbx,.blend,.zip"
                  onChange={(e) => handleFileSelect(e, 'model')}
                  className="hidden"
                  required
                />
                <label htmlFor="modelFile" className="cursor-pointer">
                  <FileUp className="mx-auto h-12 w-12 text-zinc-400 mb-3" />
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-zinc-500">
                    Supported: .stl, .obj, .fbx, .blend, .zip (Max 1GB)
                  </p>
                  {modelFile && (
                    <Badge className="mt-3 bg-black dark:bg-white text-white dark:text-black">
                      {modelFile.name} ({(modelFile.size / 1024 / 1024).toFixed(2)} MB)
                    </Badge>
                  )}
                </label>
              </div>
              <p className="text-xs text-zinc-500">Automatically set after upload</p>
            </div>

            {/* Preview Image */}
            <div className="space-y-3">
              <Label htmlFor="imageFile" className="text-base font-semibold">Upload Preview Image (Optional)</Label>
              <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-8 text-center bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, 'image')}
                  className="hidden"
                />
                <label htmlFor="imageFile" className="cursor-pointer">
                  <ImageIcon className="mx-auto h-12 w-12 text-zinc-400 mb-3" />
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">
                    Click to upload preview image
                  </p>
                  <p className="text-xs text-zinc-500">
                    PNG, JPG, or WebP (Recommended: 1200x1200px)
                  </p>
                  {imageFile && (
                    <Badge className="mt-3 bg-black dark:bg-white text-white dark:text-black">
                      {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                    </Badge>
                  )}
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Progress */}
        {isUploading && (
          <Card className="mb-6 border-2 border-zinc-300 dark:border-zinc-700">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-3">
                  <div
                    className="bg-black dark:bg-white h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="submit"
            size="lg"
            disabled={isUploading}
            className="flex-1 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-lg py-6"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Upload Product
              </>
            )}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => router.push('/admin/products')}
            disabled={isUploading}
            className="border-2 border-zinc-300 dark:border-zinc-700"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

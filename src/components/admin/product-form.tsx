/**
 * Product Create/Edit Form with Secure File Upload
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { SecureFileUpload } from './secure-file-upload'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  isFree: boolean
  category: string
  tags: string
  fileUrl: string
  fileSize: number
  previewImages: string
  thumbnail: string
  featured: boolean
}

interface Props {
  product: Product | null
}

const categories = [
  'FIGURES', 'MINIATURES', 'TERRAIN', 'VEHICLES', 'TOOLS', 
  'DICE', 'JEWELRY', 'HOME_DECOR', 'TOYS', 'GADGETS', 'ART', 'OTHER'
]

export function ProductForm({ product }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: product || {
      name: '',
      slug: '',
      description: '',
      price: 0,
      isFree: true,
      category: 'OTHER',
      tags: '',
      fileUrl: '',
      fileSize: 0,
      previewImages: '',
      thumbnail: '',
      featured: false,
    }
  })

  const isFree = watch('isFree')

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    if (!product) {
      setValue('slug', generateSlug(name))
    }
  }

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const url = product 
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products'
      
      const res = await fetch(url, {
        method: product ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast({
          title: 'Success',
          description: product ? 'Product updated successfully' : 'Product created successfully',
        })
        router.push('/admin/products')
        router.refresh()
      } else {
        throw new Error('Failed to save product')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="p-6">
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Basic Information</h2>
            
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                {...register('name', { required: true })}
                onChange={onNameChange}
                placeholder="Articulated Dragon"
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">Name is required</p>}
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...register('slug', { required: true })}
                placeholder="articulated-dragon"
              />
              {errors.slug && <p className="text-sm text-red-500 mt-1">Slug is required</p>}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register('description', { required: true })}
                rows={4}
                placeholder="Fully articulated dragon with moving joints..."
              />
              {errors.description && <p className="text-sm text-red-500 mt-1">Description is required</p>}
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                defaultValue={product?.category || 'OTHER'}
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                {...register('tags')}
                placeholder="dragon, articulated, flexible, toys"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Pricing</h2>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFree"
                {...register('isFree')}
                className="rounded"
              />
              <Label htmlFor="isFree">Free Product</Label>
            </div>

            {!isFree && (
              <div>
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price', { required: !isFree, min: 0 })}
                  placeholder="24.99"
                />
              </div>
            )}
          </div>

          {/* Files */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Files</h2>
            
            <div>
              <Label>Upload 3D Model File *</Label>
              <SecureFileUpload
                onFileUploaded={(url, size) => {
                  setValue('fileUrl', url)
                  setValue('fileSize', size / (1024 * 1024)) // Convert to MB
                }}
                accept=".stl,.obj,.fbx,.blend,.zip"
                maxSize={100}
              />
            </div>

            <div>
              <Label htmlFor="fileUrl">File URL (Auto-filled)</Label>
              <Input
                id="fileUrl"
                {...register('fileUrl', { required: true })}
                placeholder="/uploads/filename.stl"
                readOnly
              />
              <p className="text-sm text-gray-400 mt-1">Automatically set after upload</p>
            </div>

            <div>
              <Label htmlFor="fileSize">File Size (MB) (Auto-filled)</Label>
              <Input
                id="fileSize"
                type="number"
                step="0.01"
                {...register('fileSize', { required: true, min: 0 })}
                placeholder="12.5"
                readOnly
              />
            </div>

            <div>
              <Label htmlFor="thumbnail">Thumbnail URL *</Label>
              <Input
                id="thumbnail"
                {...register('thumbnail', { required: true })}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div>
              <Label htmlFor="previewImages">Preview Images (JSON array)</Label>
              <Input
                id="previewImages"
                {...register('previewImages')}
                placeholder='["https://..."]'
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Settings</h2>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                {...register('featured')}
                className="rounded"
              />
              <Label htmlFor="featured">Featured Product</Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6 border-t">
            <Link href="/admin/products">
              <Button type="button" variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </div>
      </Card>
    </form>
  )
}

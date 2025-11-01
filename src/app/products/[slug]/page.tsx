import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, ShoppingCart, Heart, Eye, Calendar, FileArchive, Tag } from 'lucide-react'
import { STLViewer } from '@/components/stl-viewer'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
  })

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | 3D Marketplace`,
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const session = await getServerSession(authOptions)

  const product = await prisma.product.findUnique({
    where: { slug },
  })

  if (!product) {
    notFound()
  }

  // Parse tags and preview images
  const tags = product.tags ? JSON.parse(product.tags) : []
  const previewImages = product.previewImages ? JSON.parse(product.previewImages) : []

  // Format file size
  const formatFileSize = (mb: number) => {
    if (mb < 1) return `${(mb * 1024).toFixed(0)} KB`
    return `${mb.toFixed(2)} MB`
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="container py-12">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Images & 3D Viewer */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-900">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.name}
                width={600}
                height={600}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <FileArchive className="h-24 w-24 text-gray-600" />
              </div>
            )}
          </div>

          {/* Preview Images */}
          {previewImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {previewImages.map((image: string, index: number) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg bg-gray-900">
                  <Image
                    src={image}
                    alt={`${product.name} preview ${index + 1}`}
                    width={150}
                    height={150}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* 3D Viewer */}
          {product.fileUrl.endsWith('.stl') && (
            <Card>
              <CardHeader>
                <CardTitle>3D Preview</CardTitle>
                <CardDescription>Interactive 3D model viewer</CardDescription>
              </CardHeader>
              <CardContent>
                <STLViewer modelUrl={product.fileUrl} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Product Details */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            {product.featured && (
              <Badge className="mb-2" variant="default">
                Featured
              </Badge>
            )}
            <h1 className="mb-2 text-4xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">{product.category}</p>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            {product.isFree ? (
              <span className="text-3xl font-bold text-green-500">FREE</span>
            ) : (
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 border-y py-4">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-muted-foreground" />
              <span>{product.downloads} downloads</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <span>15 views</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>{formatDate(product.createdAt)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {session ? (
              <>
                <Link href={product.isFree ? `/api/download/${product.id}` : `/checkout?product=${product.id}`} className="flex-1">
                  <Button size="lg" className="w-full">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.isFree ? 'Download Now' : 'Add to Cart'}
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  <Heart className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link href="/auth/signin" className="flex-1">
                <Button size="lg" className="w-full">
                  Sign In to Download
                </Button>
              </Link>
            )}
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-muted-foreground">
                {product.description}
              </p>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">File Format</span>
                <span className="font-medium">.STL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">File Size</span>
                <span className="font-medium">{formatFileSize(product.fileSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price Type</span>
                <span className="font-medium">{product.isFree ? 'Free' : 'Premium'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">More in {product.category}</h2>
        <p className="text-muted-foreground">Coming soon...</p>
      </div>
    </div>
  )
}

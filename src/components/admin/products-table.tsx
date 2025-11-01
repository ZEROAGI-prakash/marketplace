/**
 * Products Management Table
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Eye, Star } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  isFree: boolean
  category: string
  downloads: number
  featured: boolean
  createdAt: Date
  _count: {
    orderItems: number
    reviews: number
  }
}

interface Props {
  products: Product[]
}

export function ProductsTable({ products }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    setLoading(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Product deleted successfully',
        })
        router.refresh()
      } else {
        throw new Error('Failed to delete')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      })
    } finally {
      setLoading(null)
    }
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    setLoading(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !featured }),
      })

      if (res.ok) {
        toast({
          title: 'Success',
          description: featured ? 'Removed from featured' : 'Added to featured',
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-800">
            <tr>
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Downloads</th>
              <th className="text-left p-4">Sales</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-800 hover:bg-gray-900/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold">{product.name}</div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant="outline">{product.category}</Badge>
                </td>
                <td className="p-4">
                  {product.isFree ? (
                    <Badge className="bg-green-500/10 text-green-500">FREE</Badge>
                  ) : (
                    <span className="font-semibold">${product.price.toFixed(2)}</span>
                  )}
                </td>
                <td className="p-4">{product.downloads.toLocaleString()}</td>
                <td className="p-4">{product._count.orderItems}</td>
                <td className="p-4">
                  <Button
                    size="sm"
                    variant={product.featured ? 'default' : 'outline'}
                    onClick={() => toggleFeatured(product.id, product.featured)}
                    disabled={loading === product.id}
                  >
                    <Star className={`h-3 w-3 mr-1 ${product.featured ? 'fill-current' : ''}`} />
                    {product.featured ? 'Featured' : 'Feature'}
                  </Button>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => router.push(`/products/${product.slug}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => router.push(`/admin/products/${product.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(product.id)}
                      disabled={loading === product.id}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

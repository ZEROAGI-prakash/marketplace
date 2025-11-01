/**
 * Top Products Component
 */

'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Download, ShoppingCart } from 'lucide-react'

interface Product {
  id: string
  name: string
  thumbnail: string
  downloads: number
  price: number
  isFree: boolean
  _count: {
    orderItems: number
  }
}

interface Props {
  products: Product[]
}

export function TopProducts({ products }: Props) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Top Products</h2>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-gray-500 w-8">
                #{index + 1}
              </div>
              <div className="relative h-12 w-12 rounded overflow-hidden">
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-400">
                  {product.isFree ? 'Free' : `$${product.price.toFixed(2)}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-gray-400" />
                <span className="font-semibold">{product.downloads.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-gray-400" />
                <span className="font-semibold">{product._count.orderItems}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

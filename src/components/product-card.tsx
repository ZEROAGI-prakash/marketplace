"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Download, Eye, ExternalLink } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/store/cart-store"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { type ExternalModel } from "@/lib/api-clients"

type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  isFree: boolean
  category: string
  thumbnail: string
  downloads: number
  featured: boolean
}

interface ProductCardProps {
  product: Product | ExternalModel
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  const { data: session } = useSession()

  const isExternal = 'source' in product
  const productSlug = 'slug' in product ? product.slug : product.name.toLowerCase().replace(/\s+/g, '-')

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      thumbnail: product.thumbnail,
      isFree: product.isFree,
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleLike = async () => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your favorites.",
        variant: "destructive",
      })
      return
    }
    setIsLiked(!isLiked)
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked
        ? `${product.name} has been removed from your favorites.`
        : `${product.name} has been added to your favorites.`,
    })
  }

  const platformBadgeColors: Record<string, string> = {
    'printables': 'bg-orange-500/90 hover:bg-orange-500',
    'thangs': 'bg-teal-500/90 hover:bg-teal-500',
    'local': 'bg-zinc-700/90 hover:bg-zinc-700',
  }
  const platformBadgeColor = isExternal ? platformBadgeColors[product.source] || '' : ''

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
      <Link href={`/products/${productSlug}`}>
        <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {isExternal && (
            <Badge className={`absolute left-2 top-2 ${platformBadgeColor} text-white text-xs border-0`}>
              {product.source.toUpperCase()}
            </Badge>
          )}
          {('featured' in product && product.featured) && (
            <Badge className="absolute left-2 top-2 bg-black/80 hover:bg-black border-0" variant="default">
              Featured
            </Badge>
          )}
          {product.isFree && (
            <Badge className="absolute right-2 top-2 bg-green-500/90 hover:bg-green-500 text-white border-0" variant="success">
              FREE
            </Badge>
          )}
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20">
            <div className="flex h-full items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <Button size="sm" variant="secondary" className="gap-2 bg-white/90 hover:bg-white">
                <Eye className="h-4 w-4" />
                Quick View
              </Button>
            </div>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/products/${productSlug}`}>
              <h3 className="font-semibold line-clamp-1 hover:text-black dark:hover:text-white">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{product.category}</p>
            {isExternal && 'creator' in product && (
              <p className="text-xs text-zinc-500 dark:text-zinc-500">by {product.creator}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleLike}
          >
            <Heart
              className={`h-4 w-4 ${
                isLiked ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3">
          {product.description}
        </p>

        <div className="flex items-center text-xs text-zinc-600 dark:text-zinc-400">
          <Download className="mr-1 h-3 w-3" />
          {product.downloads.toLocaleString()} downloads
          {isExternal && 'likes' in product && (
            <>
              <Heart className="ml-3 mr-1 h-3 w-3" />
              {product.likes.toLocaleString()} likes
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center gap-2">
          <div className="flex-1">
            {product.isFree ? (
              <span className="text-lg font-bold text-green-600 dark:text-green-500">FREE</span>
            ) : (
              <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
          {isExternal && 'externalUrl' in product ? (
            <>
              <Button onClick={handleAddToCart} size="sm" className="gap-2 bg-black hover:bg-zinc-800 text-white" disabled={product.isFree}>
                <ShoppingCart className="h-4 w-4" />
                {product.isFree ? 'Free' : 'Add'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-300 dark:border-zinc-700"
                onClick={() => window.open(product.externalUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button onClick={handleAddToCart} size="sm" className="gap-2 bg-black hover:bg-zinc-800 text-white">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

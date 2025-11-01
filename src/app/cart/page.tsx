"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCartStore } from "@/store/cart-store"

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice())
  const clearCart = useCartStore((state) => state.clearCart)

  const freeItems = items.filter((item) => item.isFree)
  const paidItems = items.filter((item) => !item.isFree)

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center py-16">
          <ShoppingBag className="mb-4 h-24 w-24 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
          <p className="mb-6 text-muted-foreground">
            Start adding some amazing 3D models to your cart!
          </p>
          <Link href="/products">
            <Button className="gap-2">
              Browse Models
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Shopping Cart</h1>
        <p className="mt-2 text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cart Items</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearCart}>
                Clear All
              </Button>
            </CardHeader>
            <CardContent className="divide-y">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={item.thumbnail}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.isFree ? (
                          <span className="font-medium text-green-600">FREE</span>
                        ) : (
                          <span className="font-medium">${item.price.toFixed(2)}</span>
                        )}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-fit gap-2 text-red-600 hover:text-red-700"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${getTotalPrice.toFixed(2)}</span>
                </div>
                {freeItems.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Free items</span>
                    <span className="font-medium text-green-600">{freeItems.length}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Processing fee</span>
                  <span className="font-medium">$0.00</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold">${getTotalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              {getTotalPrice > 0 ? (
                <Link href="/checkout" className="w-full">
                  <Button className="w-full gap-2">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button className="w-full gap-2" asChild>
                  <Link href="/checkout">
                    Download Free Models
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Link href="/products" className="w-full">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Info */}
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Instant digital download</p>
                <p>✓ Lifetime access to files</p>
                <p>✓ Secure payment processing</p>
                <p>✓ Money-back guarantee</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

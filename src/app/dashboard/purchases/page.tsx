import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'My Purchases | 3D Marketplace',
  description: 'View your purchased 3D models',
}

export default async function PurchasesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard/purchases')
  }

  const purchases = await prisma.order.findMany({
    where: {
      userId: session.user.id,
      status: 'COMPLETED',
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">My Purchases</h1>
        <p className="text-muted-foreground">
          View and download your purchased 3D models
        </p>
      </div>

      {purchases.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Purchases Yet</CardTitle>
            <CardDescription>
              You haven&apos;t purchased any models yet. Browse our collection to get started!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/products">
              <Button>Browse Models</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {purchases.map((order: any) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                    <CardDescription>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-t pt-4 first:border-t-0 first:pt-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-800">
                          {item.product.thumbnail ? (
                            <img
                              src={item.product.thumbnail}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Package className="h-8 w-8 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.product.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="font-semibold">${item.price.toFixed(2)}</p>
                        <Link href={`/dashboard/downloads?product=${item.product.id}`}>
                          <Button size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

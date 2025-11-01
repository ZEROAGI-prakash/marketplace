import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileArchive, HardDrive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Downloads | 3D Marketplace',
  description: 'Download your purchased 3D models',
}

export default async function DownloadsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard/downloads')
  }

  const purchases = await prisma.orderItem.findMany({
    where: {
      order: {
        userId: session.user.id,
        status: 'COMPLETED',
      },
    },
    include: {
      product: true,
      order: true,
    },
    orderBy: {
      order: {
        createdAt: 'desc',
      },
    },
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">My Downloads</h1>
        <p className="text-muted-foreground">
          Access and download your purchased 3D models
        </p>
      </div>

      {purchases.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Downloads Available</CardTitle>
            <CardDescription>
              Purchase models to access downloads here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/products">
              <Button>Browse Models</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {purchases.map((item: any) => (
            <Card key={item.id} className="flex flex-col">
              <CardHeader>
                <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-gray-800">
                  {item.product.thumbnail ? (
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FileArchive className="h-16 w-16 text-gray-600" />
                    </div>
                  )}
                </div>
                <CardTitle className="line-clamp-2">{item.product.name}</CardTitle>
                <CardDescription>{item.product.category}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">File Size</span>
                    <span className="flex items-center font-medium">
                      <HardDrive className="mr-1 h-4 w-4" />
                      {formatFileSize(item.product.fileSize)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Downloads</span>
                    <span className="font-medium">{item.product.downloads}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Purchased</span>
                    <span className="font-medium">
                      {new Date(item.order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Link href={`/api/download/${item.product.id}`} className="mt-4 block">
                    <Button className="w-full" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download STL
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

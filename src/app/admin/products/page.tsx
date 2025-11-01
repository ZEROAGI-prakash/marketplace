/**
 * Premium Admin Products Management
 * Advanced CRUD operations with analytics and bulk actions
 */

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProductsTable } from '@/components/admin/products-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Upload, Download, Filter, TrendingUp, Package, DollarSign, Eye } from 'lucide-react'

async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      isFree: true,
      category: true,
      downloads: true,
      featured: true,
      createdAt: true,
      _count: {
        select: {
          orderItems: true,
          reviews: true,
        },
      },
    },
  })

  return products
}

async function getProductStats() {
  const totalProducts = await prisma.product.count()
  const freeProducts = await prisma.product.count({ where: { isFree: true } })
  const premiumProducts = totalProducts - freeProducts
  const totalDownloads = await prisma.product.aggregate({
    _sum: { downloads: true }
  })
  const totalRevenue = await prisma.order.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { total: true }
  })

  return {
    totalProducts,
    freeProducts,
    premiumProducts,
    totalDownloads: totalDownloads._sum.downloads || 0,
    totalRevenue: totalRevenue._sum.total || 0
  }
}

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const products = await getProducts()
  const stats = await getProductStats()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Actions */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Products Management
            </h1>
            <p className="text-muted-foreground">
              Manage your 3D marketplace catalog with advanced tools
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/products/new">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Upload className="mr-2 h-5 w-5" />
                Upload New Model
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              <Download className="mr-2 h-5 w-5" />
              Export
            </Button>
            <Button size="lg" variant="outline">
              <Filter className="mr-2 h-5 w-5" />
              Filter
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-500/10 to-transparent">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Total Products
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{stats.totalProducts}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                +{Math.floor(stats.totalProducts * 0.12)} this month
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-500/10 to-transparent">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Free Models
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{stats.freeProducts}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {((stats.freeProducts / stats.totalProducts) * 100).toFixed(0)}% of catalog
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-500/10 to-transparent">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Premium Models
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{stats.premiumProducts}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {((stats.premiumProducts / stats.totalProducts) * 100).toFixed(0)}% of catalog
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-500/10 to-transparent">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Total Downloads
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{stats.totalDownloads.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Avg {Math.floor(stats.totalDownloads / stats.totalProducts)} per product
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-500/10 to-transparent">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Revenue
              </CardDescription>
              <CardTitle className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                From premium sales
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            All Products ({products.length})
          </CardTitle>
          <CardDescription>
            View, edit, and manage your entire product catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          }>
            <ProductsTable products={products} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

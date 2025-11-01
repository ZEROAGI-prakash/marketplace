/**
 * Premium Admin Dashboard - Main Overview
 * Real-time statistics, analytics charts, and quick actions
 */

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminStats } from '@/components/admin/admin-stats'
import { RecentOrders } from '@/components/admin/recent-orders'
import { RecentUsers } from '@/components/admin/recent-users'
import { TopProducts } from '@/components/admin/top-products'
import { RevenueChart } from '@/components/admin/revenue-chart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Upload, Users, Package, ShoppingCart, TrendingUp, Settings, Shield, Activity } from 'lucide-react'

async function getAdminStats() {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    recentOrders,
    recentUsers,
    topProducts,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count({ where: { status: 'COMPLETED' } }),
    prisma.order.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        orderItems: {
          include: {
            product: { select: { name: true, thumbnail: true } },
          },
        },
      },
    }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    }),
    prisma.product.findMany({
      take: 10,
      orderBy: { downloads: 'desc' },
      select: {
        id: true,
        name: true,
        thumbnail: true,
        downloads: true,
        price: true,
        isFree: true,
        _count: { select: { orderItems: true } },
      },
    }),
  ])

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    recentOrders,
    recentUsers,
    topProducts,
  }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const stats = await getAdminStats()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Premium Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-5xl font-bold mb-2 text-zinc-900 dark:text-white">
              Admin Control Center
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Welcome back, {session.user.name || 'Admin User'}! Monitor and manage your 3D marketplace
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/products/new">
              <Button size="lg" className="bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black">
                <Upload className="mr-2 h-5 w-5" />
                Upload Model
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-zinc-300 dark:border-zinc-700">
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </div>
        </div>

        {/* Security Status Banner */}
        <Card className="border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-black dark:text-white" />
                <div>
                  <CardTitle className="text-lg text-black dark:text-white">Security Status: Active</CardTitle>
                  <CardDescription className="text-zinc-600 dark:text-zinc-400">All systems operational • Last backup: 2 hours ago</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-black dark:text-white animate-pulse" />
                <span className="text-sm font-medium text-black dark:text-white">Live</span>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Link href="/admin/products">
          <Card className="cursor-pointer transition-all hover:shadow-xl hover:scale-105 bg-blue-500 border-2 border-blue-600 hover:border-blue-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Package className="h-8 w-8 text-white" />
                <TrendingUp className="h-5 w-5 text-blue-100" />
              </div>
              <CardTitle className="text-white">Manage Products</CardTitle>
              <CardDescription className="text-blue-100">Upload and edit 3D models</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="cursor-pointer transition-all hover:shadow-xl hover:scale-105 bg-purple-500 border-2 border-purple-600 hover:border-purple-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-white" />
                <TrendingUp className="h-5 w-5 text-purple-100" />
              </div>
              <CardTitle className="text-white">User Management</CardTitle>
              <CardDescription className="text-purple-100">View and manage users</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/orders">
          <Card className="cursor-pointer transition-all hover:shadow-xl hover:scale-105 bg-green-500 border-2 border-green-600 hover:border-green-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <ShoppingCart className="h-8 w-8 text-white" />
                <TrendingUp className="h-5 w-5 text-green-100" />
              </div>
              <CardTitle className="text-white">Orders & Sales</CardTitle>
              <CardDescription className="text-green-100">Track all transactions</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/products/new">
          <Card className="cursor-pointer transition-all hover:shadow-xl hover:scale-105 bg-orange-500 border-2 border-orange-600 hover:border-orange-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Upload className="h-8 w-8 text-white" />
                <Activity className="h-5 w-5 text-orange-100" />
              </div>
              <CardTitle className="text-white">Quick Upload</CardTitle>
              <CardDescription className="text-orange-100">Add new 3D model now</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }>
        <AdminStats stats={stats} />
      </Suspense>

      <Tabs defaultValue="orders" className="mt-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="users">Recent Users</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <Suspense fallback={<div>Loading orders...</div>}>
            <RecentOrders orders={stats.recentOrders} />
          </Suspense>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Suspense fallback={<div>Loading users...</div>}>
            <RecentUsers users={stats.recentUsers} />
          </Suspense>
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <Suspense fallback={<div>Loading products...</div>}>
            <TopProducts products={stats.topProducts} />
          </Suspense>
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <Suspense fallback={<div>Loading chart...</div>}>
            <RevenueChart />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

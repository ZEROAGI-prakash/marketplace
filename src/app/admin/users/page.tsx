/**
 * Admin Users Management with Advanced Security
 */

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UsersTable } from '@/components/admin/users-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Users, UserCheck, AlertTriangle } from 'lucide-react'

async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
          reviews: true,
          favorites: true,
        },
      },
    },
  })

  return users
}

async function getUserStats() {
  const totalUsers = await prisma.user.count()
  const adminUsers = await prisma.user.count({ where: { role: 'ADMIN' } })
  const regularUsers = await prisma.user.count({ where: { role: 'USER' } })
  const recentUsers = await prisma.user.count({
    where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
  })

  return { totalUsers, adminUsers, regularUsers, recentUsers }
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  // Enhanced security check
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [users, stats] = await Promise.all([getUsers(), getUserStats()])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Premium Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Users Management
        </h1>
        <p className="text-muted-foreground text-lg">
          Monitor and manage all user accounts with advanced security
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Total Users</CardDescription>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl text-blue-500">{stats.totalUsers}</CardTitle>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Admin Users</CardDescription>
              <Shield className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl text-purple-500">{stats.adminUsers}</CardTitle>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Regular Users</CardDescription>
              <UserCheck className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl text-green-500">{stats.regularUsers}</CardTitle>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>New This Week</CardDescription>
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl text-orange-500">{stats.recentUsers}</CardTitle>
          </CardContent>
        </Card>
      </div>

      {/* Security Notice */}
      <Card className="border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-yellow-500" />
            <div>
              <CardTitle className="text-lg">Security Notice</CardTitle>
              <CardDescription>
                Admin actions are logged and monitored. Only grant admin privileges to trusted users.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }>
        <UsersTable users={users} />
      </Suspense>
    </div>
  )
}


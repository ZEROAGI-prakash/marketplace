/**
 * Admin Orders Management
 */

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { OrdersTable } from '@/components/admin/orders-table'

async function getOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
    },
  })

  return orders
}

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const orders = await getOrders()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Orders Management</h1>
        <p className="text-gray-400">
          {orders.length} total orders
        </p>
      </div>

      <Suspense fallback={<div>Loading orders...</div>}>
        <OrdersTable orders={orders} />
      </Suspense>
    </div>
  )
}

/**
 * Recent Orders Table Component
 */

'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface Order {
  id: string
  total: number
  status: string
  createdAt: Date
  user: {
    name: string | null
    email: string
  }
  orderItems: {
    product: {
      name: string
      thumbnail: string
    }
  }[]
}

interface Props {
  orders: Order[]
}

export function RecentOrders({ orders }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/10 text-green-500'
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'PROCESSING':
        return 'bg-blue-500/10 text-blue-500'
      case 'FAILED':
        return 'bg-red-500/10 text-red-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold">{order.user.name || order.user.email}</p>
                <p className="text-sm text-gray-400">
                  {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">${order.total.toFixed(2)}</p>
                <p className="text-sm text-gray-400">
                  {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                </p>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

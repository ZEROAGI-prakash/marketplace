/**
 * Orders Management Table
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { formatDistanceToNow } from 'date-fns'

interface Order {
  id: string
  total: number
  status: string
  paymentIntent: string | null
  createdAt: Date
  user: {
    id: string
    name: string | null
    email: string
  }
  orderItems: {
    id: string
    price: number
    product: {
      id: string
      name: string
      price: number
    }
  }[]
}

interface Props {
  orders: Order[]
}

export function OrdersTable({ orders }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

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
      case 'REFUNDED':
        return 'bg-purple-500/10 text-purple-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    setLoading(id)
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        toast({
          title: 'Success',
          description: `Order status updated to ${newStatus}`,
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-800">
            <tr>
              <th className="text-left p-4">Order ID</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Items</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Date</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-900/50">
                <td className="p-4">
                  <span className="font-mono text-sm text-gray-400">
                    {order.id.slice(0, 8)}...
                  </span>
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-semibold">{order.user.name || 'No Name'}</div>
                    <div className="text-sm text-gray-400">{order.user.email}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-semibold">${order.total.toFixed(2)}</span>
                </td>
                <td className="p-4">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </td>
                <td className="p-4 text-sm text-gray-400">
                  {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    {order.status === 'PENDING' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(order.id, 'COMPLETED')}
                        disabled={loading === order.id}
                      >
                        Complete
                      </Button>
                    )}
                    {order.status === 'COMPLETED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(order.id, 'REFUNDED')}
                        disabled={loading === order.id}
                      >
                        Refund
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

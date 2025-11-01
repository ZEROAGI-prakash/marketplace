/**
 * Recent Users Table Component
 */

'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
  _count: {
    orders: number
  }
}

interface Props {
  users: User[]
}

export function RecentUsers({ users }: Props) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Recent Users</h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user.name || 'No Name'}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold">{user._count.orders} orders</p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                </p>
              </div>
              <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                {user.role}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

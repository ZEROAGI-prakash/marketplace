/**
 * Revenue Chart Component
 */

'use client'

import { Card } from '@/components/ui/card'

export function RevenueChart() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Revenue Overview</h2>
      <div className="h-[400px] flex items-center justify-center border border-dashed border-gray-700 rounded-lg">
        <div className="text-center">
          <p className="text-gray-400 mb-2">Chart Coming Soon</p>
          <p className="text-sm text-gray-500">
            Install recharts or chart.js for visualization
          </p>
        </div>
      </div>
    </Card>
  )
}

/**
 * Admin API - Products Management
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Create Product
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const data = await req.json()

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: parseFloat(data.price) || 0,
        isFree: data.isFree === true || data.isFree === 'true',
        category: data.category,
        tags: data.tags || '[]',
        fileUrl: data.fileUrl,
        fileSize: parseFloat(data.fileSize) || 0,
        previewImages: data.previewImages || '[]',
        thumbnail: data.thumbnail,
        featured: data.featured === true || data.featured === 'true',
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

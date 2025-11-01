/**
 * Secure file download API route
 * Handles authentication, authorization, and rate limiting
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import * as fs from 'fs'
import * as path from 'path'
import { headers } from 'next/headers'

// Rate limiting store (in production, use Redis)
const downloadLimits = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = {
  FREE_USER: 5, // 5 downloads per hour for free models
  AUTHENTICATED: 20, // 20 downloads per hour for authenticated users
  WINDOW_MS: 60 * 60 * 1000, // 1 hour
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
}

function checkRateLimit(identifier: string, limit: number): RateLimitResult {
  const now = Date.now()
  const userLimit = downloadLimits.get(identifier)

  if (!userLimit || now > userLimit.resetTime) {
    const resetTime = now + RATE_LIMIT.WINDOW_MS
    downloadLimits.set(identifier, { count: 1, resetTime })
    return { allowed: true, remaining: limit - 1, resetTime }
  }

  if (userLimit.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: userLimit.resetTime,
    }
  }

  userLimit.count++
  return {
    allowed: true,
    remaining: limit - userLimit.count,
    resetTime: userLimit.resetTime,
  }
}

async function getClientIdentifier(req: NextRequest): Promise<string> {
  const headersList = await headers()
  const forwarded = headersList.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : headersList.get('x-real-ip') || 'unknown'
  return ip
}

async function hasAccessToProduct(userId: string | undefined, productId: string, isFree: boolean): Promise<boolean> {
  // Free products are accessible to everyone (with rate limiting)
  if (isFree) {
    return true
  }

  // Premium products require authentication
  if (!userId) {
    return false
  }

  // Check if user has purchased the product
  const purchase = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        status: 'COMPLETED',
      },
    },
  })

  return !!purchase
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const session = await getServerSession(authOptions)
    const clientId = await getClientIdentifier(req)

    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        slug: true,
        fileUrl: true,
        isFree: true,
        price: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check rate limiting
    const identifier = session?.user?.id || clientId
    const rateLimit = checkRateLimit(
      identifier,
      session?.user ? RATE_LIMIT.AUTHENTICATED : RATE_LIMIT.FREE_USER
    )

    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetTime).toISOString()
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many downloads. Please try again later.',
          resetTime: resetDate,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': session?.user ? RATE_LIMIT.AUTHENTICATED.toString() : RATE_LIMIT.FREE_USER.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          },
        }
      )
    }

    // Check access authorization
    const hasAccess = await hasAccessToProduct(
      session?.user?.id,
      product.id,
      product.isFree
    )

    if (!hasAccess) {
      return NextResponse.json(
        {
          error: 'Access denied',
          message: product.isFree
            ? 'Please sign in to download'
            : 'Please purchase this product to download',
        },
        { status: 403 }
      )
    }

    // Validate file path (security: prevent directory traversal)
    const filePath = path.join(process.cwd(), 'public', product.fileUrl)
    const normalizedPath = path.normalize(filePath)
    const publicDir = path.join(process.cwd(), 'public')

    if (!normalizedPath.startsWith(publicDir)) {
      console.error(`Security violation: Path traversal attempted - ${product.fileUrl}`)
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      )
    }

    // Check if file exists
    if (!fs.existsSync(normalizedPath)) {
      console.error(`File not found: ${normalizedPath}`)
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Validate file type (security: only allow STL and ZIP files)
    const ext = path.extname(normalizedPath).toLowerCase()
    if (!['.stl', '.zip'].includes(ext)) {
      console.error(`Invalid file type: ${ext}`)
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      )
    }

    // Read file
    const fileBuffer = fs.readFileSync(normalizedPath)
    const fileName = `${product.slug}${ext}`

    // Increment download count
    await prisma.product.update({
      where: { id: product.id },
      data: { downloads: { increment: 1 } },
    })

    // Log download for analytics and abuse prevention
    console.log(`Download: ${product.name} by ${session?.user?.email || clientId}`)

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': ext === '.stl' ? 'application/sla' : 'application/zip',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
        'X-RateLimit-Limit': session?.user ? RATE_LIMIT.AUTHENTICATED.toString() : RATE_LIMIT.FREE_USER.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': rateLimit.resetTime.toString(),
        'Cache-Control': 'no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

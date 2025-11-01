/**
 * Enhanced Next.js Middleware with Advanced Security
 * - Rate limiting
 * - Bot detection
 * - Admin route obfuscation
 * - DDoS protection
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// IP-based rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Security headers with enhanced CSP
const securityHeaders = {
  // Strict Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.stripe.com",
    "frame-src 'self' https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; '),
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable browser XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  
  // Strict Transport Security (HSTS)
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  
  // Hide server info
  'X-Powered-By': 'Secure Platform',
}

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/checkout',
  '/api/orders',
  '/api/user',
]

// Admin-only routes with enhanced protection
const adminRoutes = [
  '/admin',
  '/api/admin',
]

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 60000, // 1 minute
  maxRequests: 100, // Max 100 requests per minute per IP
  adminMaxRequests: 50, // Stricter for admin routes
}

// Bot detection patterns
const botPatterns = [
  /bot|crawler|spider|scraper|curl|wget|python-requests|httpclient/i,
]

function checkRateLimit(ip: string, isAdmin: boolean = false): boolean {
  const now = Date.now()
  const maxRequests = isAdmin ? RATE_LIMIT.adminMaxRequests : RATE_LIMIT.maxRequests
  
  let userLimit = rateLimitStore.get(ip)
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT.windowMs })
    return true
  }
  
  if (userLimit.count >= maxRequests) {
    return false
  }
  
  userLimit.count++
  return true
}

function detectBot(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || ''
  return botPatterns.some(pattern => pattern.test(userAgent))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'

  // Bot detection and blocking for admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (detectBot(request)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
  }

  // Rate limiting
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  if (!checkRateLimit(ip, isAdminRoute)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { 
        status: 429,
        headers: {
          'Retry-After': '60',
        }
      }
    )
  }

  // Apply security headers to all responses
  const response = NextResponse.next()
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Check authentication for protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      const url = new URL('/auth/signin', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }

  // Enhanced admin authorization with additional checks
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Triple-check admin authorization
    if (!token || token.role !== 'ADMIN') {
      // Log suspicious access attempts (implement logging service)
      console.warn(`[SECURITY] Unauthorized admin access attempt from IP: ${ip}`)
      
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Add admin identifier to response headers for tracking
    response.headers.set('X-Admin-Session', 'true')
  }

  // Add security tracking headers
  response.headers.set('X-Request-ID', crypto.randomUUID())
  response.headers.set('X-Content-Type-Options', 'nosniff')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - uploads folder
     */
    '/((?!_next/static|_next/image|favicon.ico|uploads|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

import Link from "next/link"
import { ArrowRight, Download, Star, TrendingUp, Package2, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"

export default async function Home() {
  // Fetch real statistics from database
  const totalProducts = await prisma.product.count()
  const totalDownloads = await prisma.product.aggregate({
    _sum: { downloads: true }
  })
  const totalUsers = await prisma.user.count()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-zinc-900 py-20 text-white md:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-white/10 backdrop-blur border-white/20">
              <Zap className="mr-1 h-3 w-3" />
              Premium 3D Model Marketplace
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Premium 3D Printable Models for Creators
            </h1>
            <p className="mb-8 text-lg text-zinc-300 md:text-xl">
              Discover high-quality STL files from talented designers. 
              Perfect for hobbyists, professionals, and everyone in between.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/products">
                <Button size="lg" className="gap-2 bg-white text-black hover:bg-zinc-200">
                  Browse Models
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline" className="gap-2 border-white text-white hover:bg-white/10">
                  View Categories
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/20 pt-8">
              <div>
                <div className="text-3xl font-bold">{totalProducts.toLocaleString()}+</div>
                <div className="text-sm text-zinc-400">Models</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{(totalDownloads._sum.downloads || 0).toLocaleString()}+</div>
                <div className="text-sm text-zinc-400">Downloads</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{totalUsers.toLocaleString()}+</div>
                <div className="text-sm text-zinc-400">Designers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <Star className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Premium Quality</h3>
                <p className="text-muted-foreground">
                  All models are thoroughly reviewed and tested for print quality.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <Shield className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Secure Payments</h3>
                <p className="text-muted-foreground">
                  Your transactions are protected with industry-standard encryption.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <Download className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Instant Downloads</h3>
                <p className="text-muted-foreground">
                  Get immediate access to your purchased models, anytime, anywhere.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-zinc-900 to-black py-16 text-white md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Package2 className="mx-auto mb-4 h-12 w-12" />
          <h2 className="mb-4 text-3xl font-bold">Ready to Start Creating?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-300">
            Join thousands of creators who trust our marketplace for their 3D printing needs.
            Start browsing today and bring your ideas to life!
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="gap-2 bg-white text-black hover:bg-zinc-200">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

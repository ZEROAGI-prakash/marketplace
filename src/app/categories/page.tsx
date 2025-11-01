import { Metadata } from 'next'
import Link from 'next/link'
import { Package, Briefcase, Gamepad2, Home, Shapes, User, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Categories | 3D Marketplace',
  description: 'Browse 3D models by category',
}

const categories = [
  {
    name: 'Characters',
    slug: 'characters',
    description: '3D character models for games and animations',
    icon: User,
    count: 0,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    name: 'Environments',
    slug: 'environments',
    description: 'Complete environment and scene models',
    icon: Home,
    count: 0,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    name: 'Props',
    slug: 'props',
    description: 'Objects, items, and props for your scenes',
    icon: Package,
    count: 0,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    name: 'Architecture',
    slug: 'architecture',
    description: 'Buildings, structures, and architectural elements',
    icon: Briefcase,
    count: 0,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    name: 'Vehicles',
    slug: 'vehicles',
    description: 'Cars, spaceships, and all types of vehicles',
    icon: Gamepad2,
    count: 0,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    name: 'Abstract',
    slug: 'abstract',
    description: 'Abstract and geometric 3D models',
    icon: Shapes,
    count: 0,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-zinc-900 via-black to-zinc-900 text-white py-16 border-b-2 border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <Badge className="mb-4 bg-white/20 backdrop-blur border-2 border-white/40 text-white font-semibold">
              6 Categories Available
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Browse by Category
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto drop-shadow">
              Explore our extensive collection of 3D models organized by category
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.slug} href={`/products?category=${category.slug}`}>
                <Card className="h-full transition-all hover:shadow-2xl hover:scale-105 border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 group">
                  <CardHeader>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="rounded-xl bg-zinc-900 dark:bg-white p-4 transition-transform group-hover:scale-110 border-2 border-zinc-800 dark:border-zinc-200">
                        <Icon className="h-8 w-8 text-white dark:text-black" />
                      </div>
                      <Badge variant="secondary" className="text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border-2 border-zinc-300 dark:border-zinc-600 font-semibold">
                        {category.count} models
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-base mt-2 text-zinc-600 dark:text-zinc-400">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-zinc-900 dark:text-white font-semibold group-hover:gap-2 transition-all">
                      <span>Browse {category.name}</span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Card className="text-center p-8 bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-shadow">
            <div className="text-5xl font-bold text-zinc-900 dark:text-white mb-3">0</div>
            <p className="text-zinc-900 dark:text-white font-semibold text-lg">Total Models</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 font-medium">Ready for upload</p>
          </Card>
          <Card className="text-center p-8 bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-shadow">
            <div className="text-5xl font-bold text-zinc-900 dark:text-white mb-3">6</div>
            <p className="text-zinc-900 dark:text-white font-semibold text-lg">Categories</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 font-medium">Well organized</p>
          </Card>
          <Card className="text-center p-8 bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-shadow">
            <div className="text-5xl font-bold text-zinc-900 dark:text-white mb-3">100%</div>
            <p className="text-zinc-900 dark:text-white font-semibold text-lg">Free to Browse</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 font-medium">Start exploring</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, SlidersHorizontal, Grid3x3, LayoutGrid, RefreshCcw, Loader2 } from "lucide-react"
import { modelClient, type ExternalModel } from "@/lib/api-clients"

// No fallback products - empty state
const fallbackProducts: ExternalModel[] = []

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [products, setProducts] = useState<ExternalModel[]>(fallbackProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Disabled: Don't fetch models from external APIs
  // useEffect(() => {
  //   loadModels()
  // }, [])

  const loadModels = async () => {
    // Disabled - no external API fetching
    setIsLoading(true)
    setError(null)
    try {
      // Don't fetch from external APIs
      setProducts([])
    } catch (err) {
      console.error('Failed to load models:', err)
      setError('No models available')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    loadModels()
  }

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || 
                           product.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesPrice = priceFilter === "all" ||
                        (priceFilter === "free" && product.isFree) ||
                        (priceFilter === "paid" && !product.isFree)
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "downloads":
        return b.downloads - a.downloads
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "popular":
      default:
        return b.downloads - a.downloads
    }
  })

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
            {/* Hero Section */}
      <div className="bg-gradient-to-r from-zinc-900 via-black to-zinc-900 text-white py-12 border-b-2 border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
              Discover 3D Models
            </h1>
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-white/20 hover:bg-white/30 border-2 border-white/40 text-white backdrop-blur-sm font-semibold"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
          <p className="text-xl text-zinc-300 mb-4 mt-3">
            Browse high-quality STL files from <span className="font-semibold text-white">talented designers</span>
          </p>
          {error && (
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              ⚠️ {error}
            </Badge>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 mb-8 border-2 border-zinc-200 dark:border-zinc-700">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
              <Input
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white placeholder:text-zinc-500"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-[200px] bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="figures">Figures</SelectItem>
                <SelectItem value="toys">Toys</SelectItem>
                <SelectItem value="home decor">Home Decor</SelectItem>
                <SelectItem value="cosplay">Cosplay</SelectItem>
                <SelectItem value="tools">Tools</SelectItem>
                <SelectItem value="miniatures">Miniatures</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Filter */}
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-full lg:w-[150px] bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-[180px] bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="downloads">Most Downloads</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory !== "all" || priceFilter !== "all") && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t-2 border-zinc-200 dark:border-zinc-700">
              {searchQuery && (
                <Badge variant="secondary" className="gap-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery("")} className="hover:text-red-500 font-bold">×</button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="gap-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("all")} className="hover:text-red-500 font-bold">×</button>
                </Badge>
              )}
              {priceFilter !== "all" && (
                <Badge variant="secondary" className="gap-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700">
                  {priceFilter === "free" ? "Free only" : "Paid only"}
                  <button onClick={() => setPriceFilter("all")} className="hover:text-red-500 font-bold">×</button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setPriceFilter("all")
                }}
                className="text-xs text-zinc-900 dark:text-zinc-100 hover:text-red-500 font-medium"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-zinc-100 dark:bg-zinc-900 rounded-lg h-80 animate-pulse"
              />
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-xl border-2 border-zinc-200 dark:border-zinc-700">
            <div className="bg-black dark:bg-white p-6 rounded-full mb-6">
              <SlidersHorizontal className="h-16 w-16 text-white dark:text-black" />
            </div>
            <h3 className="text-3xl font-bold mb-3 text-zinc-900 dark:text-white">No Models Yet</h3>
            <p className="text-zinc-600 dark:text-zinc-300 text-center mb-6 max-w-md text-lg">
              Products will appear here once the admin uploads 3D models to the marketplace
            </p>
            {(searchQuery || selectedCategory !== "all" || priceFilter !== "all") && (
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setPriceFilter("all")
                }}
                variant="outline"
                className="border-2 border-zinc-300 dark:border-zinc-600"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {sortedProducts.length > 0 && (
          <div className="mt-12 flex justify-center gap-2">
            <Button variant="outline" disabled className="border-zinc-300 dark:border-zinc-700">Previous</Button>
            <Button variant="default" className="bg-black hover:bg-zinc-800 text-white">1</Button>
            <Button variant="outline" className="border-zinc-300 dark:border-zinc-700">2</Button>
            <Button variant="outline" className="border-zinc-300 dark:border-zinc-700">3</Button>
            <Button variant="outline" className="border-zinc-300 dark:border-zinc-700">Next</Button>
          </div>
        )}
      </div>
    </div>
  )
}

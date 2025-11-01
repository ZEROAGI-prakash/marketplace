"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { ShoppingCart, User, Search, Menu, Package, Heart, LayoutDashboard, ShoppingBag, Download, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/store/cart-store"
import { useState, useEffect } from "react"
import { Input } from "./ui/input"

export function Navbar() {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const cartItemCount = useCartStore((state) => state.getItemCount())
  const [searchOpen, setSearchOpen] = useState(false)

  // Fix hydration error
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Package className="h-6 w-6" />
            <span className="text-xl font-bold">3D Marketplace</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
              Browse Models
            </Link>
            <Link href="/categories" className="text-sm font-medium transition-colors hover:text-primary">
              Categories
            </Link>
            {session?.user.role === 'ADMIN' && (
              <Link href="/admin" className="text-sm font-medium text-orange-500 transition-colors hover:text-orange-600">
                Admin
              </Link>
            )}
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden md:flex"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {mounted && cartItemCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Favorites */}
            {session && (
              <Link href="/favorites">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* User Menu */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                      <AvatarFallback>{session.user.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 p-0 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden" align="end" forceMount>
                  {/* Header Section */}
                  <div className="relative p-5 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 border-3 border-white shadow-xl ring-4 ring-white/30">
                        <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                        <AvatarFallback className="bg-white text-black font-bold text-xl">
                          {session.user.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        {session.user.name && <p className="font-bold text-base text-white drop-shadow-md">{session.user.name}</p>}
                        {session.user.email && (
                          <p className="w-[170px] truncate text-xs text-white/90 drop-shadow">
                            {session.user.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Main Menu Section */}
                  <div className="p-3 space-y-2 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
                    <DropdownMenuItem asChild className="cursor-pointer p-0">
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                        <div className="p-1.5 bg-white/20 rounded-lg">
                          <LayoutDashboard className="h-5 w-5" />
                        </div>
                        <span className="flex-1">Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild className="cursor-pointer p-0">
                      <Link href="/dashboard/purchases" className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                        <div className="p-1.5 bg-white/20 rounded-lg">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                        <span className="flex-1">My Purchases</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild className="cursor-pointer p-0">
                      <Link href="/dashboard/downloads" className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                        <div className="p-1.5 bg-white/20 rounded-lg">
                          <Download className="h-5 w-5" />
                        </div>
                        <span className="flex-1">Downloads</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  
                  {/* Footer Section */}
                  <div className="p-3 pt-0 space-y-2 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
                    <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent mb-2"></div>
                    
                    <DropdownMenuItem asChild className="cursor-pointer p-0">
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 text-zinc-700 dark:text-zinc-300 font-medium group">
                        <div className="p-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg group-hover:bg-zinc-300 dark:group-hover:bg-zinc-600 transition-colors">
                          <Settings className="h-4 w-4" />
                        </div>
                        <span className="flex-1">Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                      <div className="p-1.5 bg-white/20 rounded-lg">
                        <LogOut className="h-5 w-5" />
                      </div>
                      <span className="flex-1">Log out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar (Expanded) */}
        {searchOpen && (
          <div className="py-4">
            <Input
              type="search"
              placeholder="Search for 3D models..."
              className="w-full"
            />
          </div>
        )}
      </div>
    </nav>
  )
}

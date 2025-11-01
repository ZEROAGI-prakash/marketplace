import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Heart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Favorites | 3D Marketplace',
  description: 'Your favorite 3D models',
}

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/favorites')
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">My Favorites</h1>
        <p className="text-muted-foreground">
          Your saved 3D models collection
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-red-500" />
            <div>
              <CardTitle>Favorites Feature Coming Soon</CardTitle>
              <CardDescription>
                Save your favorite models to access them quickly later
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Link href="/products">
            <Button>Browse Models</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Admin - Create/Edit Product
 */

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/admin/product-form'

interface Props {
  params: Promise<{ id: string }>
}

async function getProduct(id: string) {
  if (id === 'new') return null

  const product = await prisma.product.findUnique({
    where: { id },
  })

  return product
}

export default async function AdminProductEditPage({ params }: Props) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const { id } = await params
  const product = await getProduct(id)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {product ? 'Edit Product' : 'Create New Product'}
        </h1>
        <p className="text-gray-400">
          {product ? `Editing: ${product.name}` : 'Add a new 3D model to your marketplace'}
        </p>
      </div>

      <Suspense fallback={<div>Loading form...</div>}>
        <ProductForm product={product} />
      </Suspense>
    </div>
  )
}

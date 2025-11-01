import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearAllProducts() {
  try {
    console.log('🗑️  Deleting all products...')
    
    // Delete all order items first (foreign key constraint)
    const deletedOrderItems = await prisma.orderItem.deleteMany({})
    console.log(`✅ Deleted ${deletedOrderItems.count} order items`)
    
    // Delete all products
    const deletedProducts = await prisma.product.deleteMany({})
    console.log(`✅ Deleted ${deletedProducts.count} products`)
    
    console.log('✨ Database cleared! Ready for new products.')
  } catch (error) {
    console.error('❌ Error clearing products:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearAllProducts()

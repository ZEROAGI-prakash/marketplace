/**
 * Database seed script for 3D marketplace
 * Run: npx tsx prisma/seed.ts
 */

import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...\n')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@3dmarketplace.com' },
    update: {},
    create: {
      email: 'admin@3dmarketplace.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✓ Created admin user')

  // Create test user
  const testPassword = await bcrypt.hash('test123', 10)
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: testPassword,
      role: 'USER',
    },
  })
  console.log('✓ Created test user')

  // Create FREE 3D models
  const freeModels = [
    {
      name: 'Articulated Dragon',
      slug: 'articulated-dragon',
      description: 'Fully articulated dragon with moving joints. No supports needed! Perfect for display or play. This amazing print-in-place dragon features multiple articulation points allowing for dynamic poses.',
      price: 0,
      isFree: true,
      category: 'FIGURES' as const,
      tags: JSON.stringify(['dragon', 'articulated', 'flexible', 'toys', 'print-in-place']),
      fileUrl: '/models/free/articulated-dragon-v1.stl',
      fileSize: 12.5,
      previewImages: JSON.stringify(['https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800']),
      thumbnail: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=600&h=600&fit=crop',
      downloads: 25420,
      featured: true,
    },
    {
      name: 'Flexi Rex Dinosaur',
      slug: 'flexi-rex-dinosaur',
      description: 'Flexible T-Rex with articulated joints. Fun and easy to print! Kids absolutely love it. Features a unique flexible body that prints as one piece.',
      price: 0,
      isFree: true,
      category: 'TOYS' as const,
      tags: JSON.stringify(['dinosaur', 'flexi', 'articulated', 'toy', 'kids']),
      fileUrl: '/models/free/flexi-rex-v1.stl',
      fileSize: 8.3,
      previewImages: JSON.stringify(['https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800']),
      thumbnail: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600&h=600&fit=crop',
      downloads: 32900,
      featured: true,
    },
    {
      name: 'Cable Management Clips',
      slug: 'cable-management-clips',
      description: 'Universal cable organizers for desk and wall mounting. Pack of 20 different sizes included. Keep your workspace tidy with these practical clips.',
      price: 0,
      isFree: true,
      category: 'TOOLS' as const,
      tags: JSON.stringify(['cable', 'organizer', 'desk', 'utility', 'practical']),
      fileUrl: '/models/free/cable-clips-v1.stl',
      fileSize: 2.1,
      previewImages: JSON.stringify(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']),
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
      downloads: 48200,
      featured: true,
    },
    {
      name: 'Planetary Gear Fidget',
      slug: 'planetary-gear-fidget',
      description: 'Mesmerizing planetary gear system. Print-in-place with smooth action. No assembly required! Watch the gears move in perfect harmony.',
      price: 0,
      isFree: true,
      category: 'TOYS' as const,
      tags: JSON.stringify(['gear', 'fidget', 'mechanical', 'print-in-place']),
      fileUrl: '/models/free/planetary-gear-v1.stl',
      fileSize: 5.7,
      previewImages: JSON.stringify(['https://images.unsplash.com/photo-1620756768662-08c03716f742?w=800']),
      thumbnail: 'https://images.unsplash.com/photo-1620756768662-08c03716f742?w=600&h=600&fit=crop',
      downloads: 21580,
      featured: true,
    },
    {
      name: 'Sample Cube (Test)',
      slug: 'sample-cube',
      description: 'A simple 1cm cube for testing your 3D printer calibration. Perfect for first layer tests and basic printer diagnostics.',
      price: 0,
      isFree: true,
      category: 'OTHER' as const,
      tags: JSON.stringify(['test', 'calibration', 'cube', 'simple']),
      fileUrl: '/models/free/sample-cube.stl',
      fileSize: 0.001,
      previewImages: JSON.stringify(['https://images.unsplash.com/photo-1606041011872-596597976b25?w=800']),
      thumbnail: 'https://images.unsplash.com/photo-1606041011872-596597976b25?w=600&h=600&fit=crop',
      downloads: 103500,
      featured: false,
    },
  ]

  for (const model of freeModels) {
    await prisma.product.upsert({
      where: { slug: model.slug },
      update: {},
      create: model,
    })
    console.log(`✓ Created free model: ${model.name}`)
  }

  // Create PREMIUM 3D models
  const premiumModels = [
    {
      name: 'Cyberpunk Helmet',
      slug: 'cyberpunk-helmet',
      description: 'Futuristic wearable helmet perfect for cosplay. Split into printable pieces with detailed assembly guide. Features LED mounting points and adjustable sizing.',
      price: 24.99,
      isFree: false,
      category: 'OTHER' as const,
      tags: JSON.stringify(['cyberpunk', 'helmet', 'cosplay', 'wearable', 'futuristic']),
      fileUrl: '/models/premium/cyberpunk-helmet-v2.zip',
      fileSize: 145.3,
      previewImages: JSON.stringify(['https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800']),
      thumbnail: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=600&h=600&fit=crop',
      downloads: 4450,
      featured: true,
    },
    {
      name: 'Samurai Armor Set',
      slug: 'samurai-armor-set',
      description: 'Complete wearable samurai armor for cosplay. Life-sized and highly detailed with comprehensive assembly guide. Includes chest plate, shoulder guards, helmet, and more.',
      price: 49.99,
      isFree: false,
      category: 'OTHER' as const,
      tags: JSON.stringify(['samurai', 'armor', 'cosplay', 'wearable', 'japanese']),
      fileUrl: '/models/premium/samurai-armor-complete-v1.zip',
      fileSize: 328.7,
      previewImages: JSON.stringify(['https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=800']),
      thumbnail: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=600&h=600&fit=crop',
      downloads: 2890,
      featured: false,
    },
    {
      name: 'Mandalorian Helmet',
      slug: 'mandalorian-helmet',
      description: 'Screen-accurate helmet inspired by the popular space bounty hunter. Sized for adults with LED mounting points included. Split into easy-to-print pieces.',
      price: 34.99,
      isFree: false,
      category: 'OTHER' as const,
      tags: JSON.stringify(['mandalorian', 'helmet', 'star-wars', 'cosplay', 'armor']),
      fileUrl: '/models/premium/mandalorian-helmet-v3.zip',
      fileSize: 187.2,
      previewImages: JSON.stringify(['https://images.unsplash.com/photo-1608889476518-738c9b1dcb7e?w=800']),
      thumbnail: 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb7e?w=600&h=600&fit=crop',
      downloads: 9420,
      featured: false,
    },
  ]

  for (const model of premiumModels) {
    await prisma.product.upsert({
      where: { slug: model.slug },
      update: {},
      create: model,
    })
    console.log(`✓ Created premium model: ${model.name}`)
  }

  console.log('\n✅ Database seeded successfully!')
  console.log('\n📝 Test credentials:')
  console.log('Admin: admin@3dmarketplace.com / admin123')
  console.log('User:  test@example.com / test123\n')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

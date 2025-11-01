# 🔧 SETUP & ERROR FIXES

## Current Issues Found

### 1. ❌ DATABASE_URL Not Configured
**Error**: `Environment variable not found: DATABASE_URL`

**Solution**: You need to set up a PostgreSQL database. Choose ONE option:

#### Option A: Use SQLite (Easiest - No Setup Required)
```bash
# 1. Update prisma/schema.prisma
# Change line 6-7 from:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# To:
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

# 2. Regenerate Prisma Client
npm run db:generate

# 3. Push schema to database
npm run db:push

# 4. Seed database
npm run db:seed
```

#### Option B: Use PostgreSQL (Recommended for Production)
```bash
# 1. Install PostgreSQL (if not installed)
brew install postgresql@15
brew services start postgresql@15

# 2. Create database
createdb 3d_marketplace

# 3. Update .env.local with real credentials
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/3d_marketplace?schema=public"

# Replace YOUR_USERNAME with your Mac username
# Example: DATABASE_URL="postgresql://zero@localhost:5432/3d_marketplace?schema=public"

# 4. Push schema
npm run db:push

# 5. Seed database
npm run db:seed
```

#### Option C: Use Neon/Supabase (Cloud PostgreSQL - Free Tier)
```bash
# 1. Go to https://neon.tech or https://supabase.com
# 2. Create a free account
# 3. Create a new project
# 4. Copy the connection string
# 5. Update .env.local:
DATABASE_URL="postgresql://user:password@host.region.provider.com/database?sslmode=require"

# 6. Push and seed
npm run db:push
npm run db:seed
```

---

## Quick Fix (Use SQLite)

Run these commands to get started immediately:

```bash
cd "/Users/zero/Desktop/kushal doshi/3d-marketplace"

# Install SQLite support
npm install better-sqlite3 @types/better-sqlite3

# Update Prisma schema to use SQLite
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts      Account[]
  sessions      Session[]
  orders        Order[]
  reviews       Review[]
  cart          CartItem[]
  favorites     Favorite[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String
  price       Float
  isFree      Boolean  @default(false)
  category    Category
  tags        String
  fileUrl     String
  fileSize    Float
  previewImages String
  thumbnail   String
  downloads   Int      @default(0)
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  orderItems  OrderItem[]
  reviews     Review[]
  cartItems   CartItem[]
  favorites   Favorite[]
}

model Order {
  id              String      @id @default(cuid())
  userId          String
  total           Float
  status          OrderStatus @default(PENDING)
  paymentIntent   String?     @unique
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  orderItems OrderItem[]
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  productId String
  price     Float
  createdAt DateTime @default(now())
  
  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])
  
  @@unique([orderId, productId])
}

model CartItem {
  id        String   @id @default(cuid())
  userId    String
  productId String
  createdAt DateTime @default(now())
  
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  productId String
  createdAt DateTime @default(now())
  
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
}

model Review {
  id        String   @id @default(cuid())
  rating    Int
  comment   String
  userId    String
  productId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
}

enum Role {
  USER
  ADMIN
}

enum Category {
  FIGURES
  MINIATURES
  TERRAIN
  VEHICLES
  TOOLS
  DICE
  JEWELRY
  HOME_DECOR
  TOYS
  GADGETS
  ART
  OTHER
}

enum OrderStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
}
EOF

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database
npm run db:seed

# Start dev server
npm run dev
```

---

## Other Warnings (Not Critical)

### Middleware Deprecation Warning
**Warning**: `The "middleware" file convention is deprecated. Please use "proxy" instead.`

**Status**: ⚠️ Non-blocking - site works fine
**Fix**: Will be updated in Next.js 16 stable release

---

## Verification Steps

After setup, verify everything works:

```bash
# 1. Check database connection
npm run db:push

# 2. Seed data
npm run db:seed

# 3. Build project
npm run build

# 4. Start server
npm run dev
```

Then visit:
- Homepage: http://localhost:3000
- Products: http://localhost:3000/products
- Sign In: http://localhost:3000/auth/signin

---

## Test Credentials (After Seeding)

```
Admin Login:
Email: admin@3dmarketplace.com
Password: admin123

User Login:
Email: test@example.com
Password: test123
```

---

## Summary

**Main Issue**: Database not configured
**Quick Solution**: Use SQLite (copy commands above)
**Recommended**: Set up PostgreSQL or use Neon.tech

All other code is working correctly! 🎉

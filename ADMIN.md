# 3D Marketplace Admin Dashboard

Complete admin dashboard system for managing products, users, and orders.

## Features

### Dashboard Overview
- **Statistics Cards**: Total users, products, orders, and revenue
- **Recent Orders**: Latest 5 orders with status badges
- **Recent Users**: Latest 5 registered users
- **Top Products**: Most downloaded models
- **Revenue Chart**: Monthly revenue visualization (placeholder)

### Products Management (`/admin/products`)
- **CRUD Operations**: Create, read, update, delete products
- **Inline Editing**: Click product name to edit
- **Featured Toggle**: Mark products as featured
- **Product Form Fields**:
  - Name, slug (auto-generated)
  - Description (textarea)
  - Price, category, tags (JSON array)
  - File URL, file size
  - Preview images (JSON array)
  - Thumbnail URL
  - Featured status
  - Free/Premium toggle

### Users Management (`/admin/users`)
- **View All Users**: Email, role, join date
- **Role Management**: Toggle between USER and ADMIN
- **Delete Users**: Remove user accounts (cannot delete self)

### Orders Management (`/admin/orders`)
- **View All Orders**: User, product, amount, status, date
- **Status Updates**: Change order status (PENDING, COMPLETED, FAILED)
- **Order Details**: View complete order information

## API Routes

### Products API
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `PATCH /api/admin/products/[id]` - Partial update (e.g., toggle featured)
- `DELETE /api/admin/products/[id]` - Delete product

### Users API
- `PATCH /api/admin/users/[id]` - Update user role
- `DELETE /api/admin/users/[id]` - Delete user (with self-deletion prevention)

### Orders API
- `PATCH /api/admin/orders/[id]` - Update order status

## Authentication & Security

- **Admin-Only Access**: All routes require ADMIN role
- **Session Validation**: Uses NextAuth for authentication
- **Protected API Routes**: Middleware checks user role
- **Self-Deletion Prevention**: Admins cannot delete their own accounts

## Database Schema

### Product Fields
```prisma
model Product {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  description   String
  price         Float
  isFree        Boolean  @default(false)
  category      String
  tags          String   // JSON array stored as string
  fileUrl       String
  fileSize      Float
  previewImages String   // JSON array stored as string
  thumbnail     String
  featured      Boolean  @default(false)
  downloads     Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### User Fields
```prisma
model User {
  id        String   @id @default(cuid())
  name      String?
  email     String   @unique
  role      String   @default("USER")
  createdAt DateTime @default(now())
}
```

### Order Fields
```prisma
model Order {
  id        String   @id @default(cuid())
  userId    String
  productId String
  amount    Float
  status    String   @default("PENDING")
  createdAt DateTime @default(now())
}
```

## Component Structure

```
src/
├── app/
│   └── admin/
│       ├── page.tsx              # Main dashboard
│       ├── products/
│       │   ├── page.tsx          # Products list
│       │   └── [id]/page.tsx     # Create/edit product
│       ├── users/page.tsx        # Users management
│       └── orders/page.tsx       # Orders management
├── components/
│   └── admin/
│       ├── admin-stats.tsx       # Statistics cards
│       ├── recent-orders.tsx     # Recent orders widget
│       ├── recent-users.tsx      # Recent users widget
│       ├── top-products.tsx      # Top products widget
│       ├── revenue-chart.tsx     # Revenue chart placeholder
│       ├── products-table.tsx    # Products CRUD table
│       ├── users-table.tsx       # Users management table
│       ├── orders-table.tsx      # Orders management table
│       └── product-form.tsx      # Product create/edit form
└── app/api/admin/
    ├── products/
    │   ├── route.ts              # POST create product
    │   └── [id]/route.ts         # PUT/PATCH/DELETE product
    ├── users/
    │   └── [id]/route.ts         # PATCH/DELETE user
    └── orders/
        └── [id]/route.ts         # PATCH order status
```

## Usage

### Access Admin Dashboard
1. Log in as an admin user (role: ADMIN)
2. Click "Admin" link in navbar (orange text)
3. Navigate to /admin

### Create a Product
1. Go to Products tab
2. Click "Add Product" button
3. Fill in all fields
4. Submit form

### Manage Users
1. Go to Users tab
2. Toggle user roles (USER ↔ ADMIN)
3. Delete users if needed

### Update Order Status
1. Go to Orders tab
2. Select new status from dropdown
3. Status updates automatically

## Development

### Install Dependencies
```bash
npm install date-fns
```

### Environment Variables
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Run Development Server
```bash
npm run dev
```

### Seed Database
```bash
npx prisma db seed
```

## Seeded Data

### Admin User
- Email: admin@example.com
- Password: admin123
- Role: ADMIN

### Test User
- Email: test@example.com
- Password: test123
- Role: USER

### Products
- 5 free models (characters, environments)
- 3 premium models ($9.99-$49.99)

## Future Enhancements

- [ ] Real revenue chart with Chart.js/Recharts
- [ ] Bulk operations (delete multiple, export)
- [ ] Advanced filtering and search
- [ ] Product analytics (views, conversion rate)
- [ ] File upload integration (AWS S3, Cloudinary)
- [ ] Email notifications for orders
- [ ] Audit logs for admin actions
- [ ] Categories management page (missing /categories route)

## Security Best Practices

✅ Role-based access control
✅ Server-side authentication checks
✅ Rate limiting on downloads
✅ CSP and HSTS headers
✅ Input validation
✅ SQL injection prevention (Prisma ORM)
✅ XSS protection (React escaping)

## Troubleshooting

### TypeScript Errors
If you see "Cannot find module" errors:
1. Restart TypeScript server (CMD+Shift+P → Restart TS Server)
2. Delete `.next` folder and restart dev server

### Database Issues
```bash
# Reset database
npx prisma migrate reset

# Regenerate Prisma client
npx prisma generate
```

### Missing Categories Page
The `/categories` route returns 404. Create it:
```bash
mkdir -p src/app/categories
touch src/app/categories/page.tsx
```

## License

MIT

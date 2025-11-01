# 🎨 3D Marketplace - Premium 3D Printable Models

A modern, full-stack e-commerce platform for buying and selling 3D printable STL models. Built with Next.js 16, TypeScript, Prisma, and Tailwind CSS with **enterprise-grade security**.

## ✨ Features

### 🛍️ **E-Commerce Core**
- Beautiful product catalog with advanced filtering and search
- Shopping cart with persistent state (Zustand + localStorage)
- Secure checkout process with Stripe integration
- Free and paid models support
- Instant digital downloads after purchase
- **1GB file upload support** for large STL files

### 🔐 **Authentication & Security**
- NextAuth.js integration with multiple providers
- Email/password authentication with PBKDF2 encryption
- Google OAuth sign-in
- Role-based access control (ADMIN/USER)
- **Advanced Security Features**:
  - Rate limiting (100 req/min regular, 30 req/min admin)
  - Bot detection and blocking
  - CSRF protection with origin validation
  - Anti-DevTools protection (F12 blocked)
  - Strict Content Security Policy (CSP)
  - HTTP security headers (HSTS, XSS protection, no MIME sniffing)
  - Admin action audit logging
  - Triple-layer authentication for admin routes

### 🎨 **User Interface**
- Modern, responsive design with Tailwind CSS
- Reusable component library (shadcn/ui)
- Interactive 3D model previewer (Three.js + React Three Fiber)
- Dark mode support
- Toast notifications
- **Premium gradient designs** on admin dashboard

### 🗄️ **Database & Backend**
- SQLite database with Prisma ORM (PostgreSQL ready)
- Type-safe database queries
- RESTful API routes
- Secure file upload with SHA-256 hashing
- UUID-based filename generation

### 👨‍💼 **Admin Dashboard**
- Premium design with gradient headers
- Real-time analytics (products, users, orders, revenue)
- Secure file upload system (up to 1GB)
- User management with role assignment
- Product management with bulk operations
- Security status monitoring
- Quick action cards with hover effects

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- SQLite (included) or PostgreSQL
- Stripe account (for payments)
- Optional: Google OAuth credentials

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**

Update the `.env.local` file with your credentials:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/3d_marketplace"
NEXTAUTH_SECRET="your-secret-key-change-this"
GOOGLE_CLIENT_ID="your_google_client_id" # Optional
GOOGLE_CLIENT_SECRET="your_google_client_secret" # Optional
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_key"
STRIPE_SECRET_KEY="sk_test_your_key"
```

3. **Set up the database**

```bash
npx prisma generate
npx prisma migrate dev
```

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
3d-marketplace/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   ├── lib/                    # Utilities & configs
│   ├── store/                  # Zustand state management
│   └── hooks/                  # Custom React hooks
├── prisma/
│   └── schema.prisma          # Database schema
└── public/                    # Static assets
```

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI:** shadcn/ui + Radix UI
- **Database:** PostgreSQL + Prisma
- **Auth:** NextAuth.js
- **Payments:** Stripe
- **3D Viewer:** Three.js
- **State:** Zustand

## 📦 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## 🎯 Features Implemented

- [x] User authentication (email/password & Google OAuth)
- [x] Product catalog with filtering & search
- [x] Shopping cart system
- [x] Checkout process
- [x] User dashboard
- [x] 3D model viewer
- [x] Responsive design

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

**Built with ❤️ for the 3D printing community**


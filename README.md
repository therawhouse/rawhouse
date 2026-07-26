# The Raw House - Luxury E-Commerce Platform

> Production-ready, scalable, and high-fashion e-commerce platform for **The Raw House** (`rawhouse.in`), inspired directly by the visual elegance, typography, and editorial luxury of **Gucci**.

---

## 💎 Design Aesthetic & Philosophy
Inspired by **Gucci**'s editorial runway showcases, The Raw House design system combines:
- **Color Palette**: Dark Espresso (`#140e0c`), Bronze Gold (`#c69255`), Silk Ivory (`#f9f6f0`), Charcoal Accents (`#241b18`).
- **Typography**: High-fashion editorial serif (`Cormorant Garamond` / `Playfair Display`) paired with geometric sans-serif (`Inter`).
- **Layouts**: Full-screen campaign hero sliders, asymmetric editorial lookbook cards, multi-column campaign mega menus, sticky PDP purchase columns, side-sliding shopping bag drawers, and sleek dark admin suites.

---

## 🛠️ Technology Stack & Architecture

### **Domain & DNS Manager**
- **Domain Registrar**: GoDaddy (`rawhouse.in`).
- **DNS Management**: Update GoDaddy Nameservers / A & CNAME records to point to Vercel.

### **Hosting & Infrastructure**
- **Hosting Platform**: Vercel with automatic CI/CD deployment on every Git push to `main`.
- **SSL Certificate**: Vercel Free SSL Certificate for HTTPS encryption.

### **Frontend**
- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript.
- **Styling**: Tailwind CSS + Custom Gucci color tokens.
- **Components & Icons**: Lucide React + shadcn/ui design pattern.
- **Animations**: Framer Motion for micro-animations and smooth carousel transitions.
- **Forms & Validation**: React Hook Form + Zod validation schemas.
- **Toasts**: Sonner toast notifications.

### **Backend & Database**
- **API Runtime**: Next.js 15 API Routes (`/api/*`).
- **Database**: Supabase PostgreSQL.
- **ORM**: Prisma ORM with migrations (`schema.prisma`).
- **Authentication**: Supabase Auth + JWT + bcrypt password hashing.
- **Storage**: Supabase Storage Buckets (`product-images`, `brand-assets`, `homepage-banners`, `user-profile-images`).

### **Payments & Email**
- **Payment Gateway**: Razorpay (UPI, Credit/Debit Cards, Net Banking, EMI, Wallets) with server-side HMAC-SHA256 signature verification.
- **Transactional Emails**: Resend with custom HTML luxury email templates.

### **Security & Operations**
- **Logging**: Pino structured JSON logger.
- **Documentation**: OpenAPI 3.0 Swagger (`public/docs/openapi.json`) & Postman Collection (`public/docs/postman_collection.json`).
- **Testing**: Vitest unit test suite.

---

## 🚀 Environment Setup (`.env`)

Create `.env` using `.env.example`:

```env
DATABASE_URL="postgresql://postgres:password@db.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"

SUPABASE_URL="https://your-supabase-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

JWT_SECRET="the_raw_house_super_secret_jwt_key_2026"

RAZORPAY_KEY_ID="rzp_test_key_id"
RAZORPAY_KEY_SECRET="rzp_test_key_secret"

RESEND_API_KEY="re_123456789"

NEXT_PUBLIC_SITE_URL="https://rawhouse.in"
NEXT_PUBLIC_SUPABASE_URL="https://your-supabase-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

---

## 🌐 Connecting GoDaddy Domain to Vercel

1. In **Vercel Dashboard**, go to Project Settings -> Domains -> Add `rawhouse.in` and `www.rawhouse.in`.
2. In **GoDaddy DNS Management**, update the following records:
   - **Type A**: `@` -> `76.76.21.21` (Vercel IP)
   - **CNAME**: `www` -> `cname.vercel-dns.com`
3. Vercel will automatically generate the free SSL certificate for `https://rawhouse.in`.

---

## 💻 Local Development Commands

```bash
# 1. Install Dependencies
npm install

# 2. Generate Prisma ORM Client
npm run prisma:generate

# 3. Seed Mock Luxury Products & Admin Account
npm run prisma:seed

# 4. Start Next.js Development Server
npm run dev

# 5. Run Vitest Unit Tests
npm test
```

---

## 📂 Scalable Project Directory Structure

```
rawhouse/
├── app/                  # Next.js 15 App Router pages & API routes
│   ├── admin/            # Gucci-style Admin Dashboard suite
│   ├── api/              # REST APIs (products, payments, auth, orders)
│   ├── catalog/          # Product Listing Page (PLP)
│   ├── product/[slug]/   # Product Detail Page (PDP)
│   ├── layout.tsx        # Root Layout & Metadata API
│   ├── page.tsx          # Master Luxury Home Page
│   ├── robots.ts         # Robots.txt generator
│   └── sitemap.ts        # XML Sitemap generator
├── components/           # Reusable UI Components
│   ├── auth/             # Login / Register modals
│   ├── cart/             # Cart & Wishlist side drawers
│   ├── home/             # HeroSection, EditorialGrid, FeaturedProducts
│   ├── layout/           # Header, MegaMenu, Footer
│   └── product/          # ProductCard, ProductCatalog, FilterDrawer, ProductDetail
├── lib/                  # Service integrations (Prisma, Razorpay, Resend, Supabase, Logger)
├── prisma/               # Prisma schema & seed script
├── public/               # Static assets & OpenAPI/Postman documentation
├── styles/ & globals.css # Gucci theme CSS tokens & fonts
├── tests/                # Vitest unit test suite
├── types/                # TypeScript interface definitions
└── middleware.ts         # Security & route guard middleware
```

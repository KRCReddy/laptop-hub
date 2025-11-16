# LaptopHub - Laptop Shop Application

## Overview
A comprehensive fullstack web application for a laptop shop/service center featuring intelligent product recommendations, advanced filtering, and admin management capabilities.

## Recent Changes
**November 16, 2025**
- Implemented complete fullstack application
- Created React frontend with 10+ components
- Implemented SQLite backend with 24 seeded laptop products
- Added smart matching algorithm for product recommendations
- Built admin panel with CRUD operations
- Configured responsive design with Tailwind CSS

## Project Architecture

### Frontend (React + TypeScript)
**Pages:**
- `Home.tsx` - Landing page with hero, filters, and product grid
- `ProductDetail.tsx` - Detailed product view with similar products
- `AdminLogin.tsx` - Password-protected admin authentication
- `AdminDashboard.tsx` - Admin panel for managing products and inquiries

**Components:**
- `Header.tsx` - Navigation with inquiry cart badge
- `ProductCard.tsx` - Product display with match scoring
- `FilterPanel.tsx` - Advanced filtering sidebar (collapsible on mobile)
- `InquiryCart.tsx` - Shopping cart with form submission

**Features:**
- Smart filtering by purpose, RAM, storage, CPU, screen size, brand, price
- Match scoring algorithm (+3 purpose, +2 RAM/storage, +1 brand, -1 over budget)
- Quick presets: "Under ₹50,000", "Gaming", "Student Starter"
- Pagination with 8 items per page
- Sorting: Best Match, Price (Low/High)
- Favorites with localStorage persistence
- Responsive mobile-first design

### Backend (Express + SQLite)
**Database Tables:**
- `products` - 24 seeded laptops covering ₹35k-₹189k range
- `inquiries` - Customer inquiry submissions

**API Routes:**
- `GET /api/products` - Fetch all products
- `GET /api/products/:id` - Get product details
- `POST /api/inquiries` - Submit customer inquiry
- `GET /api/admin/inquiries` - Admin: view all inquiries
- `POST /api/admin/products` - Admin: create product
- `PUT /api/admin/products/:id` - Admin: update product
- `DELETE /api/admin/products/:id` - Admin: delete product

**Seeded Products:**
24 laptops including:
- Budget: Dell Inspiron, HP 14s, Asus VivoBook (₹35k-₹45k)
- Mid-range: Lenovo ThinkPad, Acer Swift, MSI Modern (₹50k-₹80k)
- Gaming: HP Pavilion Gaming, Asus TUF, Acer Nitro (₹65k-₹125k)
- Premium: Apple MacBook Air/Pro, Dell XPS, Razer Blade (₹115k-₹189k)

## User Preferences
- **Design System**: Inter (body), Space Grotesk (display), JetBrains Mono (mono)
- **Color Scheme**: Blue primary (hsl 217 91% 35%), neutral grays
- **Admin Password**: Set via `VITE_ADMIN_PASSWORD` environment variable (default: admin123)

## Running the Application
```bash
npm run dev
```

The app runs on port 5000 and serves both frontend and backend from a single server.

## Environment Variables
- `VITE_ADMIN_PASSWORD` - Admin panel password (required)
- `PORT` - Server port (default: 5000)

## Key Technologies
- **Frontend**: React, TypeScript, Tailwind CSS, Wouter, TanStack Query, Shadcn/ui
- **Backend**: Node.js, Express, better-sqlite3, Drizzle ORM, Zod validation
- **Database**: SQLite with automatic seeding

## Database Location
`laptops.db` (created automatically on first run)

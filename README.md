# LaptopHub - Laptop Shop Service Center

A fullstack web application for a laptop shop/service center that provides intelligent product recommendations based on customer preferences. Built with React, Express, and SQLite.

## Features

### Customer-Facing Features
- **Smart Product Search**: Filter laptops by purpose, RAM, storage, CPU, screen size, brand, and price range
- **Quick Presets**: One-click filters for "Under ₹50,000", "Gaming", and "Student Starter"
- **Match Scoring Algorithm**: Products are scored based on how well they match your requirements
- **Product Details**: Comprehensive specifications, images, and similar product suggestions
- **Inquiry System**: Add products to an inquiry cart and submit your contact information
- **Favorites**: Save your favorite laptops (persisted in localStorage)
- **Responsive Design**: Beautiful UI that works seamlessly on mobile, tablet, and desktop

### Admin Features
- **Password-Protected Access**: Secure admin panel with environment-based authentication
- **Product Management**: Add, edit, and delete laptop products
- **Inquiry Management**: View all customer inquiries with product details
- **Dashboard**: Overview of total products, inquiries, and recent activity

## Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Wouter** for routing
- **TanStack Query** for data fetching
- **Shadcn/ui** component library
- **React Hook Form** with Zod validation

### Backend
- **Node.js** with Express
- **SQLite** (via better-sqlite3) for data persistence
- **Drizzle** for type-safe database schema
- **Zod** for API validation

## Getting Started

### Prerequisites
- Node.js 20.x or later

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd laptop-shop
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```bash
VITE_ADMIN_PASSWORD=your_secure_password_here
PORT=5000
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities and configurations
│   │   └── hooks/        # Custom React hooks
├── server/                # Backend Express application
│   ├── database.ts       # SQLite database initialization
│   ├── seed.ts          # Database seeding with sample products
│   ├── storage.ts       # Data access layer
│   └── routes.ts        # API route handlers
├── shared/               # Shared types and schemas
│   └── schema.ts        # Drizzle schemas and Zod validators
└── design_guidelines.md # UI/UX design specifications
```

## API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/inquiries` - Submit a product inquiry

### Admin Endpoints
- `GET /api/admin/inquiries` - Get all inquiries
- `POST /api/admin/products` - Create a new product
- `PUT /api/admin/products/:id` - Update a product
- `DELETE /api/admin/products/:id` - Delete a product

## Database Schema

### Products Table
- `id`: Unique identifier
- `brand`: Laptop brand (Dell, HP, Lenovo, etc.)
- `model`: Model name
- `price`: Price in INR
- `ram_gb`: RAM in GB
- `storage_type`: SSD, HDD, or SSD+HDD
- `storage_gb`: Storage capacity in GB
- `cpu`: Processor name
- `purpose`: Array of purposes (Office, Student, Gaming, etc.)
- `screen_in`: Screen size in inches
- `gpu`: Graphics card (optional)
- `images`: Array of image URLs
- `description`: Product description
- `availability`: Stock status

### Inquiries Table
- `id`: Unique identifier
- `name`: Customer name
- `phone`: Customer phone number
- `email`: Customer email
- `message`: Optional message
- `product_ids`: Array of product IDs
- `created_at`: Timestamp

## Match Scoring Algorithm

Products are scored based on:
- **+3 points** for each matching purpose
- **+2 points** if RAM meets or exceeds requirement
- **+2 points** if storage type matches
- **+1 point** for matching storage size
- **+1 point** for brand preference
- **-1 point** if price exceeds budget

## Customization

### Changing Admin Password
Set the `VITE_ADMIN_PASSWORD` environment variable in your `.env` file:
```bash
VITE_ADMIN_PASSWORD=your_new_secure_password
```

**Security Note**: This implementation uses basic Bearer token authentication suitable for demonstration and internal service center use. The admin password should be set via environment variable and never committed to code. For production deployment handling sensitive data, consider implementing:
- JWT tokens with expiry
- Session management with server-side storage
- Rate limiting on login attempts
- HTTPS-only cookie storage
- Multi-factor authentication

### Adding Products
You can add products through:
1. The admin panel UI (recommended for individual products)
2. Modifying the `server/seed.ts` file and restarting the server

## Deployment on Replit

1. Import this repository into Replit
2. Set environment variables in Replit Secrets:
   - `VITE_ADMIN_PASSWORD`: Your admin password
3. Click "Run" - Replit will automatically:
   - Install dependencies
   - Create the SQLite database
   - Seed sample products
   - Start the server

The app will be available at your Replit URL.

## Testing

The application includes:
- Client-side form validation with Zod
- Server-side API validation
- Error handling and loading states
- Type-safe data flow throughout

## Features Checklist

- ✅ Product search and filtering (8+ filter criteria)
- ✅ Smart matching algorithm with scoring
- ✅ Product listing with pagination (8 per page)
- ✅ Detailed product pages with similar products
- ✅ Inquiry/cart system with form validation
- ✅ Favorites using localStorage
- ✅ Password-protected admin panel
- ✅ Admin CRUD operations for products
- ✅ Admin inquiry management
- ✅ 24 seeded laptop products covering all ranges
- ✅ Responsive mobile-first design
- ✅ URL query params for shareable filter states
- ✅ Multiple sorting options (Best Match, Price)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

MIT

## Support

For issues or questions, please contact the development team.

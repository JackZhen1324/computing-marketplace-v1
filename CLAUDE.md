# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Computing Power Marketplace (算力超市) - A full-stack web application for GPU cloud computing services, built with a modern TypeScript stack.

**Tech Stack:**
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Redis
- **Frontend**: React 19, Vite, TypeScript, Ant Design, Framer Motion
- **Deployment**: Docker Compose, Nginx, GitHub Actions CI/CD

## Development Commands

### Quick Start with Docker

```bash
# Start all services (frontend, backend, postgres, redis, adminer)
cd frontend
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Service URLs:**
- Frontend: http://localhost:9210
- Backend API: http://localhost:3000
- Backend Health: http://localhost:3000/health
- Adminer (DB Admin): http://localhost:8081
- PostgreSQL: localhost:5434
- Redis: localhost:6379

### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Start database services only
docker-compose up -d postgres redis

# Run database migrations
npm run prisma:migrate
npm run prisma:generate

# Seed database with initial data
npm run prisma:seed

# Start development server
npm run dev
```

**Backend scripts:**
- `npm run build` - Compile TypeScript to `dist/`
- `npm run start` - Run production server from `dist/`
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run ESLint
- `npm run prisma:studio` - Open Prisma Studio (DB GUI)

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (Vite)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

**Note**: Frontend dev server runs on port 5177 by default.

## Architecture

### Backend Structure

```
backend/src/
├── app.ts              # Express app configuration
├── server.ts           # Server entry point
├── config/             # Configuration files
├── controllers/        # Route handlers (products, inquiries, orders, etc.)
├── middleware/         # Express middleware (auth, error handling)
├── routes/            # API route definitions
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

**Key Architecture Patterns:**
- **Controllers**: Handle HTTP requests and call services
- **Middleware**: Authentication JWT, error handling, rate limiting
- **Routes**: Organized by domain (products, inquiries, orders, solutions, etc.)
- **Prisma ORM**: Database access with type-safe queries

### Database Schema (Prisma)

**Core Models:**
- `User` - User accounts with roles (ADMIN, SALES, CUSTOMER)
- `Category` - Product categories (GPU Bare Metal, Cloud Host, etc.)
- `Product` - Computing products with features, specifications, pricing
- `Inquiry` - Customer inquiries with status workflow
- `Order` - Customer orders with line items
- `Solution` - Enterprise solutions with benefits
- `NewsArticle` - News and policy articles
- `NavigationItem` - Dynamic navigation structure
- `ActivityLog` - Audit trail for user actions

**Important Relations:**
- Products belong to Categories
- Inquiries can be converted to Orders
- Users can create inquiries and orders
- Activity logs track all user actions

### Frontend Structure

```
frontend/src/
├── App.tsx             # Main app component with routing
├── main.tsx            # React entry point
├── components/         # Reusable components
│   ├── common/         # Shared components (ProductCard, ContactForm, etc.)
│   ├── home/           # Homepage-specific components
│   └── layout/         # Layout components (Header, Footer, etc.)
├── contexts/           # React Context providers (InquiryContext)
├── data/               # Static data and mock data
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── Home/           # Homepage
│   ├── IntelligentComputing/  # GPU products pages
│   ├── GeneralComputing/      # General computing products
│   ├── Solutions/      # Solutions pages
│   ├── Admin/          # Admin dashboard
│   ├── About.tsx       # About page
│   └── News.tsx        # News page
├── services/           # API service layer
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

**Key Patterns:**
- **React Router 7**: Client-side routing
- **Context API**: Inquiry form state management
- **Axios**: HTTP client with base URL configuration
- **Ant Design**: UI component library
- **Framer Motion**: Page transitions and animations

### API Integration

Frontend communicates with backend via REST API:
- Base URL configured in `frontend/src/services/api.ts`
- API routes defined in `backend/src/routes/`
- JWT authentication for protected routes
- CORS enabled for cross-origin requests

## Docker Configuration

**Docker Compose Services** (in `frontend/docker-compose.yml`):
- `frontend` - Nginx serving React build
- `backend` - Node.js Express API server
- `postgres` - PostgreSQL database
- `redis` - Redis cache
- `adminer` - Database management UI

**Nginx Configuration** (`frontend/nginx.conf`):
- Serves frontend static files
- Proxies `/api` requests to backend container
- Handles reverse proxy headers

## Database Management

### Prisma Workflow

```bash
# After modifying schema.prisma
npm run prisma:generate  # Regenerate Prisma Client
npm run prisma:migrate   # Create and apply migration

# View database in GUI
npm run prisma:studio

# Reset database (⚠️ destroys all data)
npx prisma migrate reset
```

### Seed Data

Seed scripts populate initial data:
- `backend/scripts/seed.ts` - Basic seed data
- `backend/scripts/seed-extra.ts` - Extended seed data (products, categories, etc.)

## Testing

```bash
# Backend tests
cd backend
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report

# Frontend tests
cd frontend
npm run test              # Run tests (if configured)
```

## CI/CD

GitHub Actions workflow (`.github/workflows/deploy.yml`):
- Triggers on push to `main` branch
- SSH to production server
- Pulls latest code from GitHub
- Builds Docker images on server
- Restarts services with new containers

**Required GitHub Secrets:**
- `SERVER_HOST` - Production server IP/domain
- `SERVER_USER` - SSH username
- `SERVER_PORT` - SSH port (if non-default)
- `SSH_PRIVATE_KEY` - SSH private key for auth
- `REPO_URL` - GitHub repository URL
- `APP_URL` - Application URL for health checks

See [CI-CD-SETUP.md](CI-CD-SETUP.md) for detailed setup instructions.

## Troubleshooting

### 502 Bad Gateway
- Backend container may not be running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Restart backend: `docker-compose restart backend`

### Database Connection Issues
- Check postgres container: `docker-compose ps postgres`
- Restart database: `docker-compose restart postgres`
- Verify DATABASE_URL in `.env`

### Port Conflicts
- Check what's using the port: `lsof -i :3000`
- Stop conflicting services or change ports in `docker-compose.yml`

### Frontend Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npm run build`

## Default Credentials

- **Admin**: admin@computing-marketplace.com / Admin@123
- **Customer**: customer@example.com / Customer@123

## Important Notes

- **Node.js version**: >= 18.0.0
- **npm version**: >= 9.0.0
- **Database migrations**: Must run `prisma:generate` after schema changes
- **Environment variables**: Copy `.env.example` to `.env` and configure
- **Code style**: ESLint configured for both frontend and backend
- **TypeScript**: Strict mode enabled in both projects

## File Naming Conventions

- **Backend**: `camelCase.ts` (e.g., `productController.ts`, `authMiddleware.ts`)
- **Frontend**: `PascalCase.tsx` for components, `camelCase.ts` for utilities
- **CSS Modules**: `ModuleName.module.css` co-located with component

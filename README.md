# Dekks - Shipment Tracking Platform

A premium, high-performance shipment tracking SaaS platform with real-time fleet management, AI-powered analytics, and enterprise-grade security.

## 🚀 Tech Stack

### Frontend
- **Next.js 15** (App Router) - React framework with server components
- **Tailwind CSS** - Utility-first styling with custom obsidian theme
- **Framer Motion** - High-quality animations and transitions
- **Leaflet** - Interactive maps for real-time vessel tracking
- **Lucide Icons** - Modern icon library
- **Axios** - HTTP client with automatic token refresh

### Backend
- **FastAPI** - High-performance Python API framework
- **SQLAlchemy** - ORM with PostgreSQL
- **Alembic** - Database migration management
- **JWT** - Secure authentication with refresh tokens
- **Redis** - Caching and session management
- **WebSockets** - Real-time updates

### Infrastructure
- **PostgreSQL** - Primary database
- **Docker & Docker Compose** - Containerization
- **GCP Ready** - Cloud Run, Cloud SQL, Memorystore

---

## 📦 Quick Start

### 1. Clone and Setup Environment

```bash
# Clone the repository
git clone <repository-url>
cd shipment-tracker

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2. Configure Environment Variables

Edit `backend/.env`:
```env
DATABASE_URL=postgresql://user:password@db:5432/shipment_tracker
JWT_SECRET=your-secret-key-here
REDIS_URL=redis://redis:6379
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start Backend Services

```bash
# Start all services (PostgreSQL, Redis, Backend API)
docker compose up --build

# Or run in detached mode
docker compose up -d --build
```

The backend API will be available at `http://localhost:8000`

### 4. Run Database Migrations

```bash
# Apply all pending migrations
docker compose exec backend alembic upgrade head

# Check current migration status
docker compose exec backend alembic current
```

### 5. Install Frontend Dependencies

```bash
cd frontend
npm install
# or
yarn install
```

### 6. Run Frontend Development Server

```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

---

## 🗄️ Database Management

### Creating New Migrations

When you modify database models in `backend/app/db/models.py`:

```bash
# Generate a new migration automatically
docker compose exec backend alembic revision --autogenerate -m "description_of_changes"

# Example: Adding a new field
docker compose exec backend alembic revision --autogenerate -m "add_email_verification_field"
```

### Applying Migrations

```bash
# Apply all pending migrations
docker compose exec backend alembic upgrade head

# Apply specific migration
docker compose exec backend alembic upgrade <revision_id>

# Rollback one migration
docker compose exec backend alembic downgrade -1

# Rollback to specific revision
docker compose exec backend alembic downgrade <revision_id>
```

### Migration History

```bash
# View migration history
docker compose exec backend alembic history

# View current migration
docker compose exec backend alembic current

# View pending migrations
docker compose exec backend alembic heads
```

---

## 🛠️ Development Workflow

### Backend Development

```bash
# View backend logs
docker compose logs -f backend

# Restart backend service
docker compose restart backend

# Access backend shell
docker compose exec backend bash

# Run Python shell with app context
docker compose exec backend python
```

### Frontend Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Database Operations

```bash
# Access PostgreSQL shell
docker compose exec db psql -U user -d shipment_tracker

# Backup database
docker compose exec db pg_dump -U user shipment_tracker > backup.sql

# Restore database
docker compose exec -T db psql -U user shipment_tracker < backup.sql

# Reset database (WARNING: Deletes all data)
docker compose down -v
docker compose up -d
docker compose exec backend alembic upgrade head
```

---

## 📁 Project Structure

```
shipment-tracker/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes and endpoints
│   │   ├── core/         # Security, config, dependencies
│   │   ├── db/           # Database models and session
│   │   ├── models/       # Pydantic schemas
│   │   └── services/     # Business logic (email, etc.)
│   ├── migrations/       # Alembic database migrations
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── app/              # Next.js app directory
│   │   ├── dashboard/    # Protected dashboard routes
│   │   ├── login/        # Authentication pages
│   │   └── page.tsx      # Landing page
│   ├── components/       # Reusable React components
│   ├── lib/              # Utilities (API client, etc.)
│   └── public/           # Static assets
└── docker-compose.yml    # Development environment
```

---

## 🔐 Authentication Flow

1. **Login**: User provides email/password
2. **Token Generation**: Backend returns `access_token` (15 min) and `refresh_token` (7 days)
3. **API Requests**: Frontend attaches access token to all requests
4. **Auto-Refresh**: When access token expires, frontend automatically:
   - Calls `/auth/refresh` with refresh token
   - Gets new token pair
   - Retries failed request
   - User stays logged in seamlessly

### Authentication Endpoints

- `POST /auth/register` - Create new user account
- `POST /auth/login` - Login and get tokens
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user info

---

## 🚢 Key Features

### Dashboard
- **Real-time Fleet Map**: Interactive Leaflet map with live vessel tracking
- **Dual View Modes**: Toggle between compact tiles and detailed grid
- **Smart Stats**: Total vessels, in-transit count, on-time delivery rate
- **Glassmorphism UI**: Premium obsidian theme with orange accents

### Shipments
- **Comprehensive Tracking**: Origin, destination, status, timestamps
- **Search & Filter**: Real-time search across container IDs and shipping lines
- **Status Indicators**: Visual badges for active, moored, in-transit states
- **Detailed Views**: Modal with full shipment history and updates

### Settings
- **Profile Management**: Update user information
- **Security Controls**: 2FA, active sessions monitoring
- **API Integration**: Manage API keys for external integrations
- **Enterprise Features**: SSO, team management (coming soon)

---

## 🌐 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## 🐳 Docker Commands

```bash
# Start all services
docker compose up

# Start in background
docker compose up -d

# Stop all services
docker compose down

# Stop and remove volumes (resets database)
docker compose down -v

# Rebuild containers
docker compose up --build

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f db
```

---

## 🚀 Deployment

### Backend (Cloud Run)
```bash
# Build production image
docker build -t gcr.io/PROJECT_ID/shipment-tracker-backend ./backend

# Push to GCP
docker push gcr.io/PROJECT_ID/shipment-tracker-backend

# Deploy to Cloud Run
gcloud run deploy shipment-tracker-backend \
  --image gcr.io/PROJECT_ID/shipment-tracker-backend \
  --platform managed \
  --region us-central1
```

### Frontend (Vercel/Netlify)
```bash
# Build production bundle
cd frontend
npm run build

# Deploy to Vercel
vercel --prod
```

---

## 🧪 Testing

```bash
# Backend tests (coming soon)
docker compose exec backend pytest

# Frontend tests (coming soon)
cd frontend
npm test
```

---

## 📝 License

Proprietary - All rights reserved

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Create a migration if needed
4. Test thoroughly
5. Submit a pull request

---

## 📞 Support

For issues or questions, please contact the development team.

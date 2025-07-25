# Development Guide

This guide covers how to set up and develop the Job Search Assistant locally using Docker.

## 🚀 Quick Start (Docker)

### Prerequisites

- **Docker** and **Docker Compose**
- **Git**

### 1. Clone & Setup

```bash
git clone git@github.com:GogoRit/Job-Search.git
cd Job-Search
```

### 2. Environment Configuration

Copy the environment template and configure your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your API keys:

```env
# Required for AI features
OPENAI_API_KEY=your_openai_api_key_here

# Optional integrations
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

### 3. Start Development Environment

```bash
# Build and start all services (MongoDB, Backend, Frontend)
npm run docker:up

# Or use docker-compose directly
docker-compose up --build
```

This will start:
- **Frontend**: http://localhost:3000 (React + Vite with hot reload)
- **Backend**: http://localhost:8000 (FastAPI with auto-reload)
- **API Docs**: http://localhost:8000/docs
- **MongoDB**: mongodb://admin:password123@localhost:27017
- **MongoDB Web UI**: http://localhost:8081 (login: admin/pass - start with override file)

## 🐳 Docker Development Commands

```bash
# Start all services in detached mode
npm run docker:up

# Stop all services
npm run docker:down

# View logs from all services
npm run docker:logs

# View logs from specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mongodb

# Restart a specific service
docker-compose restart backend

# Rebuild and restart (after dependency changes)
docker-compose up --build backend
```

## 🔄 Development Workflow

### Code Changes

**Frontend Changes**: 
- Edit files in `client/` directory
- Vite hot reload will automatically update the browser

**Backend Changes**:
- Edit files in `backend/` directory  
- FastAPI auto-reload will restart the server

**Dependency Changes**:
- **Frontend**: Update `package.json`, then rebuild: `docker-compose up --build frontend`
- **Backend**: Update `backend/requirements.txt`, then rebuild: `docker-compose up --build backend`

### Database Access

```bash
# Connect to MongoDB container using mongosh
docker exec -it job-search-mongodb mongosh -u admin -p password123

# Or use a GUI tool like MongoDB Compass
# Connection: mongodb://admin:password123@localhost:27017

# Web-based admin interface (optional)
docker-compose -f docker-compose.yml -f docker-compose.override.yml up mongo-express -d
# Then visit: http://localhost:8081
# Login: admin / pass
```

**⚠️ Note**: Don't try to access MongoDB at `http://localhost:27017` in a browser - this will show an error message because MongoDB uses a binary protocol, not HTTP. Use the methods above instead.

## 📁 Project Structure

```
├── backend/              # FastAPI Python backend
│   ├── routes/          # API endpoints
│   │   ├── api_key.py   # API key management
│   │   ├── resume.py    # Resume upload/parsing
│   │   ├── jobs.py      # Job URL parsing
│   │   ├── linkedin.py  # LinkedIn integration
│   │   └── features.py  # Feature configuration
│   ├── models.py        # Pydantic data models
│   ├── database.py      # MongoDB connection
│   ├── encryption.py    # API key encryption
│   ├── main.py         # FastAPI app entry point
│   └── requirements.txt # Python dependencies
│
├── client/              # React frontend
│   ├── pages/           # Route components
│   │   ├── onboard/     # Onboarding flow
│   │   ├── Dashboard.tsx # Main dashboard
│   │   ├── Jobs.tsx     # Job parsing page
│   │   ├── Feed.tsx     # LinkedIn feed simulation
│   │   ├── Applications.tsx # Application tracking
│   │   └── Settings.tsx # Configuration
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # Shadcn/ui components
│   │   ├── MainAppLayout.tsx # Main app layout
│   │   └── OnboardingLayout.tsx # Onboarding layout
│   ├── contexts/        # React Context providers
│   ├── lib/            # Utility functions
│   └── types/          # TypeScript types
│
├── shared/              # Shared TypeScript types
├── docker-compose.yml   # Full development stack
├── Dockerfile.backend   # Backend container
├── Dockerfile.frontend  # Frontend container
└── .env.example        # Environment template
```

## �️ Adding New Features

### 1. Backend API Endpoint

```bash
# Edit files in backend/ directory
# Docker will auto-reload the FastAPI server

# Example: Add new route in backend/routes/
# Update backend/main.py to include router
# Add models in backend/models.py
```

### 2. Frontend Component/Page

```bash
# Edit files in client/ directory
# Vite will hot-reload the React app

# Example: Create component in client/pages/
# Add route in client/App.tsx
# Update navigation if needed
```

### 3. Installing Dependencies

**Frontend Dependencies**:
```bash
# Add to package.json locally, then rebuild container
npm install <package-name>
docker-compose up --build frontend
```

**Backend Dependencies**:
```bash
# Add to backend/requirements.txt locally, then rebuild container
echo "new-package==1.0.0" >> backend/requirements.txt
docker-compose up --build backend
```

## 🐛 Troubleshooting

### Container Issues

```bash
# View container status
docker-compose ps

# Restart specific service
docker-compose restart backend

# Rebuild containers (after dependency changes)
docker-compose up --build

# Clean up and restart everything
docker-compose down
docker-compose up --build
```

### Database Issues

```bash
# Check MongoDB logs
docker-compose logs mongodb

# Reset database
docker-compose down
docker volume rm job-search_mongodb_data
docker-compose up mongodb
```

### Port Conflicts

If ports are already in use, update `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "3001:3000"  # Change 3000 to 3001
  backend:
    ports:
      - "8001:8000"  # Change 8000 to 8001
```

### Performance Issues

```bash
# Check container resource usage
docker stats

# Increase memory limit in docker-compose.yml if needed
services:
  backend:
    mem_limit: 1g
```

## 🔐 Security Notes

- Database runs with authentication (admin/password123 for local dev)
- API keys are encrypted before storage
- CORS configured for localhost development
- All services run in isolated Docker network

## 🧪 Testing

```bash
# Run tests inside frontend container
docker-compose exec frontend npm run test

# Run linting
docker-compose exec frontend npm run lint

# Or run tests locally (requires Node.js)
npm test
```

## 📝 Next Steps

1. **Start Development**: Run `npm run docker:up`
2. **Configure API Keys**: Visit http://localhost:3000
3. **Check API Docs**: Visit http://localhost:8000/docs
4. **Start Coding**: Edit files and see changes automatically!

## 💡 Pro Tips

- Use `docker-compose logs -f <service>` to tail logs for specific services
- Edit files directly on your host machine - changes sync to containers
- Use browser dev tools at http://localhost:3000 for React debugging
- Visit http://localhost:8000/docs for interactive API testing

Happy Docker development! �

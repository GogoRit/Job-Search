# 🚀 AI-Powered Job Search Assistant

An open-source, personal AI-powered job application assistant that helps you streamline your job search process. Connect your accounts, upload your resume, and let AI help you apply to jobs more efficiently.

![Job Search Assistant](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)

## ✨ Features

- 🤖 **AI-Powered Responses** - Generate tailored answers to job application questions
- 📝 **Resume Integration** - Parse and use your resume data for applications
- 🔗 **Job URL Parsing** - Extract job details from LinkedIn and company career pages
- 📧 **Email Automation** - Send cold emails and follow-ups via Gmail API or SMTP
- 💼 **LinkedIn Integration** - Automated messaging and networking
- 📊 **Application Tracking** - Dashboard to track your job applications and follow-ups
- 🎯 **Outreach Templates** - Pre-built templates for various outreach scenarios
- 🔍 **Hiring Post Scanner** - Find #hiring posts and recruiter activity (coming soon)

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS + Radix UI
- **Backend**: FastAPI + Python 3.11
- **Database**: MongoDB with Motor (async driver)
- **AI**: OpenAI GPT integration for content generation
- **Security**: Encrypted API key storage with Fernet

## 🟡 Current Status

**Latest Update**: Simplified OCR Resume Parser Implementation

This project features a complete FastAPI backend with simplified resume parsing:
- ✅ Simplified OCR resume parser with PaddleOCR + spaCy integration
- ✅ Enhanced onboarding flow with clean success notifications
- ✅ Card-based resume data display on profile setup page
- ✅ Docker containerization with optimized dependencies
- ✅ Three-step onboarding flow with state management
- ✅ Secure API key storage with encryption
- ✅ Job URL parsing and mock scraping
- ✅ AI-powered outreach content generation (mock)
- ✅ LinkedIn feed simulation with hashtag filtering
- ✅ MongoDB data models and async operations

**🚧 Work Still Needed:**
- **Profile Section**: Requires refinement and validation of parsed resume data
- **OCR Parser**: Needs accuracy improvements for better field extraction
- **LinkedIn OAuth**: Implementation framework ready, only client connection in LinkedIn Dev account remains
- **Onboarding Completion**: Depends on proper OCR extraction updates

**🎯 Ready for Production:**
- Basic OCR parsing functional with PaddleOCR + PyTesseract fallback
- Clean UI with simplified resume upload flow
- Docker deployment with reduced build times
- LinkedIn integration framework prepared

## 🚀 Quick Start

### Prerequisites

- **Docker** and **Docker Compose**
- **Git**

### 1. Clone and Install

```bash
git clone git@github.com:GogoRit/Job-Search.git
cd Job-Search
```

### 2. Environment Setup

Copy the example environment file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your OpenAI API key:

```env
# Required for AI features
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start with Docker

Start the full development stack:

```bash
# Start all services (MongoDB, Backend, Frontend)
npm run docker:up

# Or use docker-compose directly
docker-compose up --build
```

The application will be available at:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **API Documentation**: `http://localhost:8000/docs`
- **MongoDB**: `mongodb://admin:password123@localhost:27017`

### 4. Alternative: Local Development

For local development without Docker, see [DEVELOPMENT.md](DEVELOPMENT.md)

# Required for email features (choose one)
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret

# OR use SMTP
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Optional: LinkedIn integration
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

### 3. Run the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

**Docker:**
```bash
docker-compose up
```

The app will be available at `http://localhost:3000`

## 🔑 Getting API Keys

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Add to `.env` as `OPENAI_API_KEY`

### Gmail API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/gmail/callback`
## 🔧 Configuration

### OpenAI API Setup
1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to `.env`: `OPENAI_API_KEY=your_key_here`

### Gmail Integration (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 credentials
3. Add to `.env`

### LinkedIn API Setup (Optional)
1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Create a new app and get credentials
3. Add to `.env`

## 📱 Usage

### 1. Onboarding Flow
1. **API Key Setup**: Add your OpenAI API key
2. **Resume Upload**: Upload and parse your resume
3. **Profile Setup**: Configure your job search preferences

### 2. Job Application Flow
1. **Parse Job URLs**: Paste job URLs to extract requirements
2. **Generate Responses**: AI creates tailored application responses
3. **Track Applications**: Monitor your application status

### 3. Outreach & Networking
1. **LinkedIn Feed**: Browse hashtag feeds for opportunities
2. **Generate Outreach**: Create personalized messages
3. **Track Follow-ups**: Monitor response rates

## 🛠️ Development

### Project Structure

```
├── client/           # React frontend
│   ├── pages/        # Route components
│   │   ├── onboard/  # Onboarding flow (API key, resume, profile)
│   │   ├── Jobs.tsx      # Job URL parsing and AI responses
│   │   ├── Feed.tsx      # LinkedIn hashtag feed simulation
│   │   ├── Dashboard.tsx # Application tracking dashboard
│   │   └── Settings.tsx  # Configuration management
│   ├── components/   # Reusable UI components
│   └── contexts/     # React context for state management
├── backend/          # FastAPI Python backend
│   ├── routes/       # API endpoints
│   ├── models.py     # Pydantic data models
│   ├── database.py   # MongoDB connection and operations
│   └── main.py       # FastAPI application entry point
├── shared/           # Shared TypeScript types
└── docker-compose.yml # MongoDB for local development
```

### Development Commands

```bash
# Docker development (recommended)
npm run docker:up         # Start all services with Docker
npm run docker:down       # Stop all services
npm run docker:logs       # View logs from all services

# Local development (alternative)
npm run dev               # Start frontend development server
npm run dev:backend       # Start backend development server  
npm run dev:full          # Start both frontend and backend (uses start-dev.sh)

# Code quality and build
npm run build             # Build frontend for production
npm run lint              # Lint code with ESLint
npm run test              # Run tests with Vitest
```

### Adding New Features

1. **Backend API**: Add endpoints in `backend/routes/`
2. **Frontend Pages**: Create components in `client/pages/`
3. **Types**: Add shared interfaces to `shared/api.ts`
4. **Database**: Update models in `backend/models.py`

## 🤝 Contributing

We welcome contributions! This project helps job seekers automate their application process.

### Areas for Contribution

- 🤖 **AI Improvements**: Better prompts and responses
- 🔗 **Integrations**: More job boards and platforms
- 📊 **Analytics**: Success tracking and insights
- 🎨 **UI/UX**: Design improvements and accessibility
- 🧪 **Testing**: Test coverage and automation
- 📚 **Documentation**: Examples and guides

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- UI components from [Radix UI](https://radix-ui.com/) and [Shadcn/ui](https://ui.shadcn.com/)
- AI powered by [OpenAI](https://openai.com/)
- Icons from [Lucide React](https://lucide.dev/)

**⭐ If this project helps you land your dream job, please consider giving it a star!**

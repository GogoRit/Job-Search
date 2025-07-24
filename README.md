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
- **Deployment**: Docker multi-container setup

## 🟡 Current Status

This is a complete refactor with new user flow and FastAPI backend:
- ✅ Docker deployment working (FastAPI + React + MongoDB)
- ✅ Three-step onboarding flow with state management
- ✅ Secure API key storage with encryption
- ✅ Resume upload and parsing (PDF/DOCX support)
- ✅ Job URL parsing and mock scraping
- ✅ AI-powered outreach content generation (mock)
- ✅ LinkedIn feed simulation with hashtag filtering
- ✅ MongoDB data models and async operations
- 🟡 Individual page functionality to be enhanced
- 🟡 Real OpenAI integration (requires API key)
- 🟡 Actual LinkedIn scraping (browser automation)

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed (recommended)
- OR: Node.js 20+, Python 3.11+, and MongoDB (for local development)

### 1. Clone and Install

```bash
git clone git@github.com:GogoRit/Job-Search.git
cd Job-Search
```

### 2. Docker Setup (Recommended)

Start the full application stack with Docker:

```bash
docker-compose up --build
```

The application will be available at:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **API Documentation**: `http://localhost:8000/docs`
- **MongoDB**: `mongodb://admin:password123@localhost:27017`

### 3. Local Development (Alternative)

For local development without Docker:

```bash
# Quick start (installs dependencies and starts all services)
./start-dev.sh

# Or manually:
npm install
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && cd ..
npm run dev:full
```

### 4. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Required for AI features
OPENAI_API_KEY=your_openai_api_key_here

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
6. Download credentials and add to `.env`

### LinkedIn API Setup
1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Create a new app
3. Request access to necessary APIs
4. Get Client ID and Secret
5. Add to `.env`

## 📱 Usage

### 1. Configuration Check
Visit `/api/config/check` to see which features are available based on your API keys.

### 2. Job Application Flow
1. **Add Job**: Paste a job URL or manually enter job details
2. **Parse Job**: AI extracts job requirements and details
3. **Generate Responses**: AI creates tailored responses to application questions
4. **Apply**: Use generated responses in your applications

### 3. Outreach Flow
1. **Find Contacts**: Identify recruiters or employees at target companies
2. **Generate Messages**: AI creates personalized outreach messages
3. **Send Messages**: Send via Gmail or LinkedIn
4. **Track Follow-ups**: Monitor response rates and schedule follow-ups

### 4. Application Tracking
- View all applications in the dashboard
- Track status changes and follow-up dates
- Analyze success rates and improve strategies

## 🛠️ Development

### Project Structure

```
├── client/           # React frontend
│   ├── pages/        # Route components
│   │   ├── onboard/  # Onboarding flow (API key, resume, LinkedIn)
│   │   ├── Discover.tsx  # Job URL parsing and outreach generation
│   │   ├── Feed.tsx      # LinkedIn hashtag feed simulation
│   │   └── Dashboard.tsx # Job application tracking
│   ├── components/   # Reusable UI components
│   └── contexts/     # React context for state management
├── backend/          # FastAPI Python backend
│   ├── routes/       # API endpoints
│   ├── models.py     # Pydantic data models
│   ├── database.py   # MongoDB connection and operations
│   └── main.py       # FastAPI application entry point
├── shared/           # Shared TypeScript types
└── docker-compose.yml # Multi-container orchestration
```

## 🗺️ User Flow

### Onboarding Process
1. **Landing Page** (`/`) - Simple CTA to "Get Started"
2. **API Key Setup** (`/onboard/api-key`) - Secure OpenAI API key storage
3. **Resume Upload** (`/onboard/resume`) - PDF/DOCX parsing and data extraction
4. **LinkedIn Setup** (`/onboard/linkedin`) - Enable LinkedIn features (demo mode)

### Main Application
1. **Dashboard** (`/dashboard`) - Job application tracking with stages
2. **Discover** (`/discover`) - Job URL parsing and AI-powered outreach generation
3. **Feed** (`/feed`) - LinkedIn hashtag following and post engagement
4. **Applications** - Application pipeline management
5. **Outreach** - Generated message templates and sending

## 🔐 Security Features

- **Encrypted API Storage**: OpenAI keys encrypted with Fernet (AES 128)
- **No API Key Exposure**: Keys never returned to frontend after storage
- **Local Processing**: Resume parsing and data extraction done server-side
- **MongoDB Security**: Authentication-enabled database with proper indexing

### Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start          # Start production server
npm run typecheck  # TypeScript validation
npm test           # Run tests
npm run format.fix # Format code with Prettier
```

### Adding New Features

1. **Add API Route**: Create handler in `server/routes/`
2. **Update Types**: Add interfaces to `shared/api.ts`
3. **Frontend Integration**: Create React components in `client/`
4. **Update Config**: Add any new environment variables

## 🐳 Docker Deployment

### Build and Run

```bash
# Build the image
docker build -t job-search-assistant .

# Run with environment file
docker run -p 3000:3000 --env-file .env job-search-assistant

# Or use docker-compose
docker-compose up
```

### Environment Variables in Docker

Create a `.env` file with your configuration:

```env
OPENAI_API_KEY=your_key_here
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
```

## 🚢 Production Deployment

### Option 1: Traditional Hosting

```bash
npm run build
npm start
```

### Option 2: Docker

```bash
docker-compose up -d
```

### Option 3: Self-contained Binary

```bash
npm run build
npm run pkg  # Creates executable for your platform
```

## 🤝 Contributing

We welcome contributions! This project is designed to be a community effort to help job seekers.

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Areas for Contribution

- 🤖 **AI Improvements**: Better prompts, fine-tuning
- 🔗 **Integrations**: More job boards, ATS systems
- 📊 **Analytics**: Success tracking, insights
- 🎨 **UI/UX**: Design improvements, accessibility
- 🧪 **Testing**: More comprehensive test coverage
- 📚 **Documentation**: Examples, tutorials, guides

## 🔒 Privacy & Security

- **Local First**: All data stays on your machine by default
- **API Keys**: Your keys are never shared or stored externally
- **Open Source**: Full transparency in how your data is used
- **Self-Hosted**: Run entirely on your own infrastructure

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Fusion Starter](https://github.com/fusion-starter) template
- UI components from [Radix UI](https://radix-ui.com/)
- AI powered by [OpenAI](https://openai.com/)

## 📞 Support

- 🐛 **Bug Reports**: [Open an issue](https://github.com/yourusername/job-search-assistant/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/yourusername/job-search-assistant/discussions)
- 💬 **Questions**: [Join our community](https://discord.gg/your-discord)

## 🗺️ Roadmap

- [ ] **v1.1**: LinkedIn automation
- [ ] **v1.2**: Resume parsing and optimization
- [ ] **v1.3**: Interview scheduling
- [ ] **v1.4**: Salary negotiation assistant
- [ ] **v1.5**: Multi-language support
- [ ] **v2.0**: Mobile app

---

**⭐ If this project helps you land your dream job, please consider giving it a star!**

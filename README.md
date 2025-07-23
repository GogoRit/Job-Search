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
- **Backend**: Express.js + TypeScript
- **AI**: OpenAI GPT-4 integration
- **Email**: Gmail API or SMTP support
- **Database**: SQLite (default) with PostgreSQL/MySQL support
- **Deployment**: Docker, Node.js binary, or traditional hosting

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (optional, for local development)

### 1. Clone and Install

```bash
git clone git@github.com:GogoRit/Job-Search.git
cd Job-Search
```

### 2. Docker Setup (Recommended)

Start the application with Docker:

```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`

### 3. Local Development (Alternative)

For local development without Docker:

```bash
npm install
npm run dev
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
├── client/                 # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Route components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utilities
├── server/                # Express backend
│   ├── routes/            # API route handlers
│   ├── config.ts          # Environment configuration
│   └── index.ts           # Server setup
├── shared/                # Shared TypeScript types
└── public/                # Static assets
```

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

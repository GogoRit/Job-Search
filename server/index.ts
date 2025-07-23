import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleFeatures } from "./routes/features";
import { handleGenerateResponse, handleGenerateOutreach, handleParseJob } from "./routes/jobs";
import { handleSendEmail, handleGetTemplates } from "./routes/outreach";
import { config, validateConfig } from "./config";

export function createServer() {
  const app = express();

  // Validate configuration on startup
  validateConfig();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check endpoint
  app.get("/api/ping", (_req, res) => {
    res.json({ 
      message: "Job Search Assistant API v1.0.0",
      status: "healthy",
      timestamp: new Date().toISOString(),
    });
  });

  // Feature availability endpoint
  app.get("/api/features", handleFeatures);

  // Configuration check endpoint
  app.get("/api/config/check", (_req, res) => {
    const features = {
      ai: !!config.openai.apiKey,
      gmail: !!config.gmail.clientId && !!config.gmail.clientSecret,
      linkedin: !!config.linkedin.clientId && !!config.linkedin.clientSecret,
      smtp: !!config.smtp.host && !!config.smtp.user,
    };

    res.json({
      features,
      recommendations: {
        ...(!features.ai && { ai: "Set OPENAI_API_KEY to enable AI-powered job application assistance" }),
        ...(!features.gmail && !features.smtp && { email: "Configure Gmail or SMTP to send emails and messages" }),
        ...(!features.linkedin && { linkedin: "Set LinkedIn credentials to enable LinkedIn integration" }),
      }
    });
  });

  // Job-related endpoints
  app.post("/api/jobs/parse", handleParseJob);
  app.post("/api/jobs/generate-response", handleGenerateResponse);
  app.post("/api/jobs/generate-outreach", handleGenerateOutreach);

  // Outreach endpoints
  app.post("/api/outreach/send-email", handleSendEmail);
  app.get("/api/outreach/templates", handleGetTemplates);

  // Example/demo endpoints
  app.get("/api/demo", handleDemo);

  return app;
}

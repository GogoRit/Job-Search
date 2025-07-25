/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
// Shared API interfaces for type safety between client and server

export interface DemoResponse {
  message: string;
}

export interface FeaturesResponse {
  ai: boolean;
  gmail: boolean;
  linkedin: boolean;
  smtp: boolean;
  hasEmailCapability: boolean;
  version: string;
  environment: string;
}

export interface ConfigCheckResponse {
  features: {
    ai: boolean;
    gmail: boolean;
    linkedin: boolean;
    smtp: boolean;
  };
  recommendations: Record<string, string>;
}

// Job-related interfaces
export interface JobData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: string;
  postedDate: string;
  url: string;
}

export interface ParseJobRequest {
  url: string;
}

export interface ParseJobResponse {
  success: boolean;
  data: JobData;
  message?: string;
}

export interface GenerateResponseRequest {
  jobDescription: string;
  resume?: string;
  question: string;
}

export interface GenerateResponseResponse {
  success: boolean;
  data: {
    response: string;
    confidence: number;
    suggestions: string[];
  };
  error?: string;
  message?: string;
}

export interface GenerateOutreachRequest {
  recipientName: string;
  recipientTitle?: string;
  company: string;
  jobTitle: string;
  personalNote?: string;
  type?: 'email' | 'linkedin';
}

export interface GenerateOutreachResponse {
  success: boolean;
  data: {
    message: string;
    subject: string;
    type: string;
  };
}

// Outreach interfaces
export interface SendEmailRequest {
  to: string;
  subject: string;
  content: string;
}

export interface SendEmailResponse {
  success: boolean;
  data: {
    messageId: string;
    status: string;
  };
  message?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

export interface GetTemplatesResponse {
  success: boolean;
  data: EmailTemplate[];
}

// Application tracking interfaces
export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: 'applied' | 'interview' | 'rejected' | 'offer' | 'withdrawn';
  appliedDate: string;
  lastUpdate: string;
  notes?: string;
  jobUrl?: string;
  salary?: string;
  location?: string;
}

export interface ApplicationsResponse {
  success: boolean;
  data: Application[];
  total: number;
}

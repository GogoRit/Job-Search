// API Response Types for Frontend

export interface FeaturesResponse {
  ai: boolean;
  gmail: boolean;
  linkedin: boolean;
  smtp: boolean;
  version: string;
  environment: string;
}

export interface ParseJobResponse {
  success: boolean;
  data?: {
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string[];
    salary?: string;
    benefits?: string[];
    url?: string;
  };
  error?: string;
}

export interface GenerateResponseResponse {
  success: boolean;
  data?: {
    coverLetter: string;
    emailResponse: string;
    keyPoints: string[];
  };
  error?: string;
}

export interface ConfigCheckResponse {
  features: {
    ai: boolean;
    gmail: boolean;
    linkedin: boolean;
    smtp: boolean;
  };
  recommendations?: {
    [key: string]: string;
  };
}

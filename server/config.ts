/**
 * Configuration management for the Job Search Assistant
 * Handles environment variables and provides fallbacks
 */

export interface AppConfig {
  // Server
  port: number;
  nodeEnv: string;
  baseUrl: string;
  sessionSecret: string;

  // AI Services
  openai: {
    apiKey: string | null;
    model: string;
  };

  // Email Services
  gmail: {
    clientId: string | null;
    clientSecret: string | null;
    redirectUri: string;
  };

  // LinkedIn Services
  linkedin: {
    clientId: string | null;
    clientSecret: string | null;
    redirectUri: string;
  };

  // Optional Services
  smtp: {
    host: string | null;
    port: number;
    user: string | null;
    pass: string | null;
  };

  // Database
  databaseUrl: string;
}

function getEnvVar(key: string, defaultValue?: string): string | null {
  const value = process.env[key];
  if (!value && !defaultValue) {
    return null;
  }
  return value || defaultValue || null;
}

function getEnvVarRequired(key: string, defaultValue?: string): string {
  const value = getEnvVar(key, defaultValue);
  if (!value) {
    console.warn(`⚠️  Environment variable ${key} is not set. Using default or app may have limited functionality.`);
    return defaultValue || '';
  }
  return value;
}

export const config: AppConfig = {
  // Server Configuration
  port: parseInt(getEnvVarRequired('PORT', '3000')),
  nodeEnv: getEnvVarRequired('NODE_ENV', 'development'),
  baseUrl: getEnvVarRequired('BASE_URL', 'http://localhost:3000'),
  sessionSecret: getEnvVarRequired('SESSION_SECRET', 'dev-secret-change-in-production'),

  // AI Services
  openai: {
    apiKey: getEnvVar('OPENAI_API_KEY'),
    model: getEnvVarRequired('OPENAI_MODEL', 'gpt-4'),
  },

  // Gmail Integration
  gmail: {
    clientId: getEnvVar('GMAIL_CLIENT_ID'),
    clientSecret: getEnvVar('GMAIL_CLIENT_SECRET'),
    redirectUri: getEnvVarRequired('GMAIL_REDIRECT_URI', 'http://localhost:3000/auth/gmail/callback'),
  },

  // LinkedIn Integration
  linkedin: {
    clientId: getEnvVar('LINKEDIN_CLIENT_ID'),
    clientSecret: getEnvVar('LINKEDIN_CLIENT_SECRET'),
    redirectUri: getEnvVarRequired('LINKEDIN_REDIRECT_URI', 'http://localhost:3000/auth/linkedin/callback'),
  },

  // SMTP Configuration (fallback for email)
  smtp: {
    host: getEnvVar('SMTP_HOST'),
    port: parseInt(getEnvVar('SMTP_PORT') || '587'),
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASS'),
  },

  // Database
  databaseUrl: getEnvVarRequired('DATABASE_URL', 'sqlite:./data/app.db'),
};

/**
 * Check which features are available based on configuration
 */
export function getAvailableFeatures() {
  return {
    ai: !!config.openai.apiKey,
    gmail: !!config.gmail.clientId && !!config.gmail.clientSecret,
    linkedin: !!config.linkedin.clientId && !!config.linkedin.clientSecret,
    smtp: !!config.smtp.host && !!config.smtp.user && !!config.smtp.pass,
    hasEmailCapability: (!!config.gmail.clientId && !!config.gmail.clientSecret) || 
                       (!!config.smtp.host && !!config.smtp.user && !!config.smtp.pass),
  };
}

/**
 * Validate configuration and log warnings for missing required services
 */
export function validateConfig() {
  const features = getAvailableFeatures();
  
  console.log('🔧 Job Search Assistant Configuration:');
  console.log(`   Port: ${config.port}`);
  console.log(`   Environment: ${config.nodeEnv}`);
  console.log(`   Base URL: ${config.baseUrl}`);
  console.log('');
  console.log('📋 Available Features:');
  console.log(`   🤖 AI (OpenAI): ${features.ai ? '✅' : '❌'}`);
  console.log(`   📧 Gmail Integration: ${features.gmail ? '✅' : '❌'}`);
  console.log(`   💼 LinkedIn Integration: ${features.linkedin ? '✅' : '❌'}`);
  console.log(`   📨 SMTP Email: ${features.smtp ? '✅' : '❌'}`);
  console.log(`   📮 Email Capability: ${features.hasEmailCapability ? '✅' : '❌'}`);
  console.log('');

  if (!features.ai) {
    console.log('💡 To enable AI features, set OPENAI_API_KEY in your .env file');
  }
  if (!features.hasEmailCapability) {
    console.log('💡 To enable email features, configure Gmail or SMTP in your .env file');
  }
  if (!features.linkedin) {
    console.log('💡 To enable LinkedIn features, set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in your .env file');
  }
  
  console.log('');
  console.log('📖 For setup instructions, see the README.md file');
  console.log('═══════════════════════════════════════════════════════════════');
}

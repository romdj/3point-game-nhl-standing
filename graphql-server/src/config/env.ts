/**
 * Environment configuration with validation
 */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export interface EnvConfig {
  NHL_API_BASE_URL: string;
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  CORS_ORIGIN: string;
}

function validateEnv(): EnvConfig {
  const env = process.env;

  return {
    NHL_API_BASE_URL: env.NHL_API_BASE_URL || 'https://api-web.nhle.com/v1',
    PORT: parseInt(env.PORT || '4000', 10),
    NODE_ENV: (env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    CORS_ORIGIN: env.CORS_ORIGIN || 'http://localhost:5173'
  };
}

export const config = validateEnv();

// Validate required environment variables
if (!config.NHL_API_BASE_URL) {
  throw new Error('NHL_API_BASE_URL environment variable is required');
}

export default config;
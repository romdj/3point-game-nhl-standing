/**
 * Server environment configuration with validation
 */

import dotenv from 'dotenv';
import { DEFAULT_PORTS } from '../constants/shared.js';

// Load environment variables from .env file
dotenv.config();

export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  NHL_API_BASE_URL: string;
  PORT: number;
  CORS_ORIGIN: string;
  GRAPHQL_PLAYGROUND: boolean;
}

function validateEnv(): EnvConfig {
  const env = process.env;

  return {
    NODE_ENV: (env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    NHL_API_BASE_URL: env.NHL_API_BASE_URL || 'https://api-web.nhle.com/v1',
    PORT: parseInt(env.PORT || DEFAULT_PORTS.GRAPHQL_SERVER.toString(), 10),
    CORS_ORIGIN: env.CORS_ORIGIN || 'http://localhost:5173',
    GRAPHQL_PLAYGROUND: env.GRAPHQL_PLAYGROUND === 'true' || env.NODE_ENV === 'development'
  };
}

export const config = validateEnv();

// Validate required environment variables
const requiredVars = ['NHL_API_BASE_URL', 'PORT'];
const missing = requiredVars.filter(key => !config[key as keyof EnvConfig]);

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

// Environment-specific configuration
export const envConfig = {
  development: {
    logLevel: 'debug',
    enableCors: true,
    enablePlayground: true,
    enableDevMode: true,
  },
  production: {
    logLevel: 'info',
    enableCors: false,
    enablePlayground: false,
    enableDevMode: false,
  },
  test: {
    logLevel: 'error',
    enableCors: true,
    enablePlayground: false,
    enableDevMode: false,
  }
}[config.NODE_ENV];

export default config;
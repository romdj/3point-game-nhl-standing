/**
 * Frontend environment configuration with validation
 */

export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  NHL_API_BASE_URL: string;
  GRAPHQL_URL: string;
  DEV_MODE: boolean;
}

function validateEnv(): EnvConfig {
  const env = import.meta.env;

  return {
    NODE_ENV: (env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    NHL_API_BASE_URL: env.VITE_NHL_API_BASE_URL || 'https://api-web.nhle.com/v1',
    GRAPHQL_URL: env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql',
    DEV_MODE: env.VITE_DEV_MODE === 'true' || env.NODE_ENV === 'development'
  };
}

export const config = validateEnv();

// Validate required environment variables
const requiredVars = ['GRAPHQL_URL'];
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
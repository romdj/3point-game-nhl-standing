/**
 * Shared environment configuration utilities
 */

export interface BaseEnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  NHL_API_BASE_URL: string;
}

export interface ServerEnvConfig extends BaseEnvConfig {
  PORT: number;
  CORS_ORIGIN: string;
  GRAPHQL_PLAYGROUND: boolean;
}

export interface ClientEnvConfig extends BaseEnvConfig {
  GRAPHQL_URL: string;
  DEV_MODE: boolean;
}

/**
 * Validates and parses environment variables with defaults
 */
export function validateServerEnv(env: Record<string, string | undefined>): ServerEnvConfig {
  return {
    NODE_ENV: (env.NODE_ENV as ServerEnvConfig['NODE_ENV']) || 'development',
    NHL_API_BASE_URL: env.NHL_API_BASE_URL || 'https://api-web.nhle.com/v1',
    PORT: parseInt(env.PORT || '4000', 10),
    CORS_ORIGIN: env.CORS_ORIGIN || 'http://localhost:5173',
    GRAPHQL_PLAYGROUND: env.GRAPHQL_PLAYGROUND === 'true' || env.NODE_ENV === 'development'
  };
}

/**
 * Validates and parses Vite environment variables with defaults
 */
export function validateClientEnv(env: Record<string, string | undefined>): ClientEnvConfig {
  return {
    NODE_ENV: (env.NODE_ENV as ClientEnvConfig['NODE_ENV']) || 'development',
    NHL_API_BASE_URL: env.VITE_NHL_API_BASE_URL || 'https://api-web.nhle.com/v1',
    GRAPHQL_URL: env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql',
    DEV_MODE: env.VITE_DEV_MODE === 'true' || env.NODE_ENV === 'development'
  };
}

/**
 * Required environment variables validation
 */
export function validateRequiredEnvVars<T extends Record<string, unknown>>(
  config: T,
  required: (keyof T)[]
): void {
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Environment-specific configuration
 */
export const ENV_CONFIGS = {
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
} as const;
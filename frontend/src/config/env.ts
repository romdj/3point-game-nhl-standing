/**
 * Frontend environment configuration
 */

export interface FrontendConfig {
  GRAPHQL_URL: string;
  DEV_MODE: boolean;
}

function validateEnv(): FrontendConfig {
  return {
    GRAPHQL_URL: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql',
    DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true' || import.meta.env.DEV
  };
}

export const config = validateEnv();

export default config;
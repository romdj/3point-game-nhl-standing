import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: 4000,
  graphqlPlayground: process.env.GRAPHQL_PLAYGROUND === 'true' || true,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost', // Add CORS origin configuration
};

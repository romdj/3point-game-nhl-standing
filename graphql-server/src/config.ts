import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: 4000,
  graphql_playground: process.env.GRAPHQL_PLAYGROUND === 'true' || true,
};

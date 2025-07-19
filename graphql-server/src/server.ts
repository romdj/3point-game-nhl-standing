import Fastify from 'fastify';
import mercurius from 'mercurius';
import { schema, resolvers } from './graphql/index.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { CORS_ORIGINS, HTTP_HEADERS } from './constants/shared.js';

const app = Fastify({
  logger: config.NODE_ENV === 'development' ? {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  } : true,
});

// Add CORS headers
app.addHook('onSend', (request, reply, payload, done) => {
  const origin = request.headers.origin;
  const allowedOrigins = config.NODE_ENV === 'production' 
    ? CORS_ORIGINS.PRODUCTION 
    : CORS_ORIGINS.DEVELOPMENT;
  
  const corsOrigin = config.CORS_ORIGIN === '*' || (origin && allowedOrigins.includes(origin)) 
    ? (origin || config.CORS_ORIGIN) 
    : config.CORS_ORIGIN;
  
  reply.headers({
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': HTTP_HEADERS.CORS_METHODS,
    'Access-Control-Allow-Headers': HTTP_HEADERS.CORS_HEADERS,
    'Access-Control-Allow-Credentials': 'true'
  });
  done();
});

// Handle OPTIONS requests
app.options('*', (request, reply) => {
  const origin = request.headers.origin;
  const allowedOrigins = config.NODE_ENV === 'production' 
    ? CORS_ORIGINS.PRODUCTION 
    : CORS_ORIGINS.DEVELOPMENT;
  
  const corsOrigin = config.CORS_ORIGIN === '*' || (origin && allowedOrigins.includes(origin)) 
    ? (origin || config.CORS_ORIGIN) 
    : config.CORS_ORIGIN;
  
  reply.headers({
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': HTTP_HEADERS.CORS_METHODS,
    'Access-Control-Allow-Headers': HTTP_HEADERS.CORS_HEADERS,
    'Access-Control-Allow-Credentials': 'true'
  }).send();
});

app.register(mercurius, {
  schema,
  resolvers,
  graphiql: config.GRAPHQL_PLAYGROUND,
});

// Health check endpoint
app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

app.listen({ port: config.PORT, host: '0.0.0.0' }, (error, serverAddress) => {
  if (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
  logger.info(`Server is running at ${serverAddress}`);
});

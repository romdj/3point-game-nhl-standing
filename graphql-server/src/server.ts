import Fastify from 'fastify';
import mercurius from 'mercurius';
import { schema, resolvers } from './graphql';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

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
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ];
  
  const corsOrigin = config.CORS_ORIGIN === '*' || (origin && allowedOrigins.includes(origin)) 
    ? (origin || config.CORS_ORIGIN) 
    : config.CORS_ORIGIN;
  
  reply.headers({
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  });
  done();
});

// Handle OPTIONS requests
app.options('*', (request, reply) => {
  const origin = request.headers.origin;
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ];
  
  const corsOrigin = config.CORS_ORIGIN === '*' || (origin && allowedOrigins.includes(origin)) 
    ? (origin || config.CORS_ORIGIN) 
    : config.CORS_ORIGIN;
  
  reply.headers({
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

app.listen({ port: config.PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
  logger.info(`Server is running at ${address}`);
});

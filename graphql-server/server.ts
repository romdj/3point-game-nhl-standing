import Fastify from 'fastify';
import mercurius from 'mercurius';
import { schema, resolvers } from './src/graphql';
import { config as oldConfig } from './src/config';
import { config } from './src/config/env.js';
import { logger } from './src/utils/logger.js';

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
  reply.headers({
    'Access-Control-Allow-Origin': config.CORS_ORIGIN, // Allow configured origins
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allow specific HTTP methods
    'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allow specific headers
  });
  done();
});

// Handle OPTIONS requests
app.options('*', (request, reply) => {
  reply.headers({
    'Access-Control-Allow-Origin': config.CORS_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }).send();
});

app.register(mercurius, {
  schema,
  resolvers,
  graphiql: oldConfig.graphql_playground,
});

app.listen({ port: config.PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
  logger.info(`Server is running at ${address}`);
});

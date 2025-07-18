import Fastify from 'fastify';
import mercurius from 'mercurius';
import { schema, resolvers } from './src/graphql';
import { config as oldConfig } from './src/config';
import config from './src/config/env.js';

const app = Fastify();

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

app.listen({ port: config.PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running at ${address}`);
});

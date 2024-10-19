import Fastify from 'fastify';
import mercurius from 'mercurius';
import { schema, resolvers } from './src/graphql';
import { config } from './src/config';

const app = Fastify();

app.register(mercurius, {
  schema,
  resolvers,
  graphiql: true,
});

app.listen({ port: config.port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running at ${address}`);
});

import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import Fastify from 'fastify';
import mercurius from 'mercurius';
import { schema, resolvers } from '../../../src/graphql';

let app: ReturnType<typeof Fastify>;

beforeAll(() => {
  app = Fastify();
  app.register(mercurius, {
    schema,
    resolvers,
    graphiql: true,
  });
});

afterAll(() => {
  app.close();
});

describe('GraphQL Standings Query', () => {
  it('returns standings data for the given date', async () => {
    const query = `
      query {
        standings(date: "2023-03-01") {
          teamName
          points
        }
      }
    `;

    const response = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query,
      },
    });

    const data = JSON.parse(response.body);
    expect(response.statusCode).toBe(200);
    expect(data.data.standings).toBeDefined();
    expect(data.data.standings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          teamName: 'Toronto Maple Leafs',
          points: expect.any(Number),
        }),
      ])
    );
  });
});

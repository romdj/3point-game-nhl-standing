"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fastify_1 = __importDefault(require("fastify"));
const mercurius_1 = __importDefault(require("mercurius"));
const graphql_1 = require("../../../src/graphql");
let app;
(0, globals_1.beforeAll)(() => {
    app = (0, fastify_1.default)();
    app.register(mercurius_1.default, {
        schema: graphql_1.schema,
        resolvers: graphql_1.resolvers,
        graphiql: true,
    });
});
(0, globals_1.afterAll)(() => {
    app.close();
});
(0, globals_1.describe)('GraphQL Standings Query', () => {
    (0, globals_1.it)('returns standings data for the given date', async () => {
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
        (0, globals_1.expect)(response.statusCode).toBe(200);
        (0, globals_1.expect)(data.data.standings).toBeDefined();
        (0, globals_1.expect)(data.data.standings).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                teamName: 'Toronto Maple Leafs',
                points: globals_1.expect.any(Number),
            }),
        ]));
    });
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const mercurius_1 = __importDefault(require("mercurius"));
const graphql_1 = require("./src/graphql");
const config_1 = require("./src/config");
const app = (0, fastify_1.default)();
// Add CORS headers
app.addHook('onSend', (request, reply, payload, done) => {
    reply.headers({
        'Access-Control-Allow-Origin': '*', // Allow all origins
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allow specific HTTP methods
        'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allow specific headers
    });
    done();
});
// Handle OPTIONS requests
app.options('*', (request, reply) => {
    reply.headers({
        'Access-Control-Allow-Origin': config_1.config.cors_origin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }).send();
});
app.register(mercurius_1.default, {
    schema: graphql_1.schema,
    resolvers: graphql_1.resolvers,
    graphiql: config_1.config.graphql_playground,
});
app.listen({ port: config_1.config.port }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server is running at ${address}`);
});

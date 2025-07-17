"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.resolvers = void 0;
const queryResolvers_1 = require("./resolvers/queryResolvers");
const querySchema_1 = require("./schemas/querySchema");
exports.resolvers = {
    Query: queryResolvers_1.teamsStandings.Query,
}; // Ensure that Query is exported in the expected format
exports.schema = querySchema_1.typeDefs;

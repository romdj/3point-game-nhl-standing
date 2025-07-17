"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const load_1 = require("@graphql-tools/load");
const graphql_file_loader_1 = require("@graphql-tools/graphql-file-loader");
const path_1 = require("path");
console.log((0, path_1.join)(__dirname, './schema.graphql')); // verifying the path to the schema file
const typeDefs = (0, load_1.loadSchemaSync)((0, path_1.join)(__dirname, './schema.graphql'), {
    loaders: [new graphql_file_loader_1.GraphQLFileLoader()],
});
exports.typeDefs = typeDefs;

"use strict";
// create test for query schema
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const load_1 = require("@graphql-tools/load");
const graphql_file_loader_1 = require("@graphql-tools/graphql-file-loader");
const path_1 = require("path");
const querySchema_1 = require("../../../src/graphql/schemas/querySchema");
(0, globals_1.describe)('querySchema', () => {
    (0, globals_1.it)('should load the schema correctly', () => {
        const schemaPath = (0, path_1.join)(__dirname, '../../../src/graphql/schemas/schema.graphql');
        const expectedTypeDefs = (0, load_1.loadSchemaSync)(schemaPath, {
            loaders: [new graphql_file_loader_1.GraphQLFileLoader()],
        });
        (0, globals_1.expect)(querySchema_1.typeDefs).toEqual(expectedTypeDefs);
    });
    (0, globals_1.it)('should have the correct path to the schema file', () => {
        const schemaPath = (0, path_1.join)(__dirname, '../../../src/graphql/schemas/schema.graphql');
        (0, globals_1.expect)(schemaPath).toBe((0, path_1.join)(__dirname, '../../../src/graphql/schemas/schema.graphql'));
    });
});

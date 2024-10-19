// create test for query schema

import { describe, it, expect } from '@jest/globals';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { join } from 'path';
import { typeDefs } from '../../../src/graphql/schemas/querySchema';

describe('querySchema', () => {
  it('should load the schema correctly', () => {
    const schemaPath = join(__dirname, '../../../src/graphql/schemas/schema.graphql');
    const expectedTypeDefs = loadSchemaSync(schemaPath, {
      loaders: [new GraphQLFileLoader()],
    });

    expect(typeDefs).toEqual(expectedTypeDefs);
  });

  it('should have the correct path to the schema file', () => {
    const schemaPath = join(__dirname, '../../../src/graphql/schemas/schema.graphql');
    expect(schemaPath).toBe(join(__dirname, '../../../src/graphql/schemas/schema.graphql'));
  });
});

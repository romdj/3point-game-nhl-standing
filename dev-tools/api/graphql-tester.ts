/**
 * GraphQL API connection testing utility
 * Tests the connection between frontend and GraphQL server
 */

import { logger } from '../utils/logger.js';

interface GraphQLResponse {
  data?: any;
  errors?: Array<{ message: string }>;
}

interface TestConfig {
  serverUrl: string;
  testQueries: Array<{
    name: string;
    query: string;
    variables?: Record<string, any>;
  }>;
}

export class GraphQLTester {
  private config: TestConfig;

  constructor(config: TestConfig) {
    this.config = config;
  }

  async testConnection(): Promise<boolean> {
    logger.section('GraphQL Connection Test');
    logger.info(`Testing connection to: ${this.config.serverUrl}`);

    try {
      const response = await fetch(this.config.serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: '{ __typename }',
        }),
      });

      if (response.ok) {
        logger.success('GraphQL server is reachable');
        return true;
      } else {
        logger.error(`Server responded with status: ${response.status}`);
        return false;
      }
    } catch (error) {
      logger.error('Cannot reach GraphQL server:', error);
      return false;
    }
  }

  async runTestQueries(): Promise<void> {
    logger.section('Running Test Queries');

    for (const test of this.config.testQueries) {
      logger.subsection(`Testing: ${test.name}`);
      
      try {
        const response = await fetch(this.config.serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: test.query,
            variables: test.variables || {},
          }),
        });

        const result: GraphQLResponse = await response.json();

        if (result.errors) {
          logger.error(`Query failed: ${test.name}`, result.errors);
        } else if (result.data) {
          logger.success(`Query succeeded: ${test.name}`);
          logger.debug('Response data:', result.data);
        } else {
          logger.warn(`Query returned no data: ${test.name}`);
        }
      } catch (error) {
        logger.error(`Query error for ${test.name}:`, error);
      }
    }
  }

  async runFullTest(): Promise<void> {
    const isConnected = await this.testConnection();
    
    if (isConnected) {
      await this.runTestQueries();
    } else {
      logger.error('Cannot run test queries - server is not reachable');
    }
  }
}

// Default configuration for NHL standings app
export const createNHLGraphQLTester = () => {
  return new GraphQLTester({
    serverUrl: 'http://localhost:4000/graphql',
    testQueries: [
      {
        name: 'Basic Schema Query',
        query: '{ __schema { queryType { name } } }',
      },
      {
        name: 'Standings Query with Date',
        query: `
          query GetStandings($date: String!) {
            standings(date: $date) {
              teamName
              points
              divisionName
              conferenceName
            }
          }
        `,
        variables: { date: '2023-04-05' },
      },
      {
        name: 'Standings Query without Date',
        query: `
          query {
            standings {
              teamName
              points
            }
          }
        `,
      },
    ],
  });
};

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = createNHLGraphQLTester();
  tester.runFullTest();
}
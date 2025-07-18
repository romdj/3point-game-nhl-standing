/**
 * Test script for current issue: No data showing on localhost:5173
 * This script tests the entire data flow from GraphQL server to frontend
 */

import { logger } from '../utils/logger.js';
import { createNHLGraphQLTester } from '../api/graphql-tester.js';

async function testCurrentIssue(): Promise<void> {
  logger.section('Testing Current Issue: No Data on Frontend');

  // Step 1: Test GraphQL server
  logger.subsection('Step 1: Test GraphQL Server');
  const graphqlTester = createNHLGraphQLTester();
  await graphqlTester.runFullTest();

  // Step 2: Test season logic
  logger.subsection('Step 2: Test Season Logic');
  await testSeasonLogic();

  // Step 3: Test the exact API call the frontend makes
  logger.subsection('Step 3: Test Frontend API Call');
  await testFrontendAPICall();

  // Step 4: Provide debugging recommendations
  logger.subsection('Step 4: Debugging Recommendations');
  provideBrowserDebuggingSteps();
}

async function testSeasonLogic(): Promise<void> {
  try {
    // Import season utils dynamically
    const seasonUtils = await import('../../front-end/src/utils/seasonUtils.js');

    const currentDate = new Date();
    const seasonYear = seasonUtils.getCurrentNHLSeasonYear(currentDate);
    const defaultDate = seasonUtils.getDefaultStandingsDate(currentDate);
    const hasData = seasonUtils.hasSeasonData(seasonYear);

    logger.info('Season Logic Results:', {
      currentDate: currentDate.toISOString().split('T')[0],
      seasonYear,
      defaultDate,
      hasData,
    });

    if (hasData) {
      logger.success('Season logic indicates data should be available');
    } else {
      logger.warn('Season logic indicates no data for current season, using fallback');
    }

  } catch (error) {
    logger.error('Cannot test season logic:', error);
  }
}

async function testFrontendAPICall(): Promise<void> {
  try {
    // Import the actual frontend API
    const { fetchStandings } = await import('../../front-end/src/api/standingsAPI.js');

    logger.info('Testing fetchStandings() function...');

    const startTime = Date.now();
    const standings = await fetchStandings();
    const endTime = Date.now();

    logger.info(`API call completed in ${endTime - startTime}ms`);

    if (standings && standings.length > 0) {
      logger.success(`✅ fetchStandings() returned ${standings.length} teams`);
      logger.info('Sample team:', standings[0]);
    } else {
      logger.error('❌ fetchStandings() returned no data');
      logger.debug('Full response:', standings);
    }

  } catch (error) {
    logger.error('Cannot test frontend API call:', error);
  }
}

function provideBrowserDebuggingSteps(): void {
  logger.info('🔧 Browser Debugging Steps:');
  console.log(`
1. Open browser developer tools (F12)
2. Go to localhost:5173
3. Check Console tab for errors
4. Check Network tab for API calls
5. Look for GraphQL requests to localhost:4000
6. Check if requests are failing or returning empty data

🔍 Console Commands to try:
- Check if data is in store: window.location.reload()
- Manual API test:
  fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      query: 'query { standings(date: "2023-04-05") { teamName points } }'
    })
  }).then(r => r.json()).then(console.log)

📊 Expected Results:
- GraphQL server should return 32 NHL teams
- Frontend should display standings in table format
- No CORS errors in console
- No GraphQL errors in Network tab
  `);
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  testCurrentIssue();
}

export { testCurrentIssue };

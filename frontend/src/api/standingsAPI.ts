import { client } from './graphqlClient';
import { gql } from '@urql/svelte';
import { getDefaultStandingsDate } from '../utils/seasonUtils';
import { AppErrorHandler } from '../utils/errorHandler';
import { logger, PerformanceLogger } from '../utils/logger';

const STANDINGS_QUERY = gql`
  query GetStandings($date: String!) {
    standings(date: $date) {
      gamesPlayed
      otWins
      internationalSystemPoints
      teamName
      points
      wins
      regulationWins
      losses
      otLosses
      divisionName
      conferenceName
    }
  }
`;

export const fetchStandings = async () => {
  const date = getDefaultStandingsDate();
  
  logger.info(`Fetching standings for date: ${date}`, { date }, 'StandingsAPI', 'fetchStandings');
  
  const result = await PerformanceLogger.measureAsync('fetchStandings', async () => {
    return await AppErrorHandler.withErrorHandling(
      async () => {
        logger.debug('Executing GraphQL query', { date }, 'StandingsAPI', 'fetchStandings');
        const queryResult = await client.query(STANDINGS_QUERY, { date });
        
        if (queryResult.error) {
          throw new Error(`GraphQL Error: ${queryResult.error.message}`);
        }
        
        if (!queryResult.data?.standings || queryResult.data.standings.length === 0) {
          logger.warn(`No standings data available for date: ${date}`, { date }, 'StandingsAPI', 'fetchStandings');
          AppErrorHandler.handleValidationError(
            `No standings data available for date: ${date}`,
            { date, queryResult: queryResult.data }
          );
          return [];
        }
        
        logger.info(`Successfully fetched ${queryResult.data.standings.length} team standings`, 
          { date, teamCount: queryResult.data.standings.length }, 
          'StandingsAPI', 
          'fetchStandings'
        );
        
        return queryResult.data.standings;
      },
      'api',
      { operation: 'fetchStandings', date }
    );
  }, 'StandingsAPI');
  
  return result || [];
};

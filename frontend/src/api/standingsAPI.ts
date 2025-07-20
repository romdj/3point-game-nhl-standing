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
      teamAbbrev
      teamLogo
      points
      wins
      regulationWins
      losses
      otLosses
      divisionName
      conferenceName
      goalFor
      goalAgainst
      goalDifferential
      winPercentage
      date
    }
  }
`;

export const fetchStandings = async () => {
  const date = getDefaultStandingsDate();
  return await fetchStandingsForDate(date);
};

export const fetchStandingsForDate = async (date: string) => {
  logger.info(`Fetching standings for date: ${date}`, { date }, 'StandingsAPI', 'fetchStandingsForDate');
  
  const result = await PerformanceLogger.measureAsync('fetchStandingsForDate', async () => {
    return await AppErrorHandler.withErrorHandling(
      async () => {
        logger.debug('Executing GraphQL query', { date }, 'StandingsAPI', 'fetchStandingsForDate');
        const queryResult = await client.query(STANDINGS_QUERY, { date });
        
        if (queryResult.error) {
          throw new Error(`GraphQL Error: ${queryResult.error.message}`);
        }
        
        if (!queryResult.data?.standings || queryResult.data.standings.length === 0) {
          logger.warn(`No standings data available for date: ${date}`, { date }, 'StandingsAPI', 'fetchStandingsForDate');
          AppErrorHandler.handleValidationError(
            `No standings data available for date: ${date}`,
            { date, queryResult: queryResult.data }
          );
          return [];
        }
        
        logger.info(`Successfully fetched ${queryResult.data.standings.length} team standings`, 
          { date, teamCount: queryResult.data.standings.length }, 
          'StandingsAPI', 
          'fetchStandingsForDate'
        );
        
        return queryResult.data.standings;
      },
      'api',
      { operation: 'fetchStandingsForDate', date }
    );
  }, 'StandingsAPI');
  
  return result || [];
};

export const fetchStandingsComparison = async (currentDate: string, historicalDate: string) => {
  logger.info(`Fetching standings comparison`, { currentDate, historicalDate }, 'StandingsAPI', 'fetchStandingsComparison');
  
  const result = await PerformanceLogger.measureAsync('fetchStandingsComparison', async () => {
    return await AppErrorHandler.withErrorHandling(
      async () => {
        const [currentStandings, historicalStandings] = await Promise.all([
          fetchStandingsForDate(currentDate),
          fetchStandingsForDate(historicalDate)
        ]);
        
        logger.info(`Successfully fetched comparison data`, { 
          currentCount: currentStandings.length, 
          historicalCount: historicalStandings.length 
        }, 'StandingsAPI', 'fetchStandingsComparison');
        
        return {
          current: currentStandings,
          historical: historicalStandings,
          currentDate,
          historicalDate
        };
      },
      'api',
      { operation: 'fetchStandingsComparison', currentDate, historicalDate }
    );
  }, 'StandingsAPI');
  
  return result || { current: [], historical: [], currentDate, historicalDate };
};

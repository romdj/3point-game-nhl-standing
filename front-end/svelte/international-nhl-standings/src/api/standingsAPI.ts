import { client } from './graphqlClient';
import { gql } from '@urql/svelte';
import { getDefaultStandingsDate } from '../utils/seasonUtils';
import { AppErrorHandler } from '../utils/errorHandler';

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
  
  const result = await AppErrorHandler.withErrorHandling(
    async () => {
      const queryResult = await client.query(STANDINGS_QUERY, { date });
      
      if (queryResult.error) {
        throw new Error(`GraphQL Error: ${queryResult.error.message}`);
      }
      
      if (!queryResult.data?.standings || queryResult.data.standings.length === 0) {
        AppErrorHandler.handleValidationError(
          `No standings data available for date: ${date}`,
          { date, queryResult: queryResult.data }
        );
        return [];
      }
      
      return queryResult.data.standings;
    },
    'api',
    { operation: 'fetchStandings', date }
  );
  
  return result || [];
};

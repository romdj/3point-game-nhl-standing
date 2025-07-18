import { client } from './graphqlClient';
import { gql } from '@urql/svelte';
import { getDefaultStandingsDate } from '../utils/seasonUtils';

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
  try {
    const date = getDefaultStandingsDate();
    console.log(`Fetching standings for date: ${date}`);
    
    const result = await client.query(STANDINGS_QUERY, { date });
    if (result.error) {
      console.error('Error fetching standings:', result.error);
    }
    if (result?.data?.standings?.length === 0) {
      console.error('Retrieved empty standings for date:', date);
    }
    return result.data.standings;
  } catch (error) {
    console.error('Error fetching standings:', error);
    return [];
  }
};

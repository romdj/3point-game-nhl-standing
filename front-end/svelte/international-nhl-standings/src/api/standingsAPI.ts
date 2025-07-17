import { client } from './graphqlClient';
import { gql } from '@urql/svelte';

const STANDINGS_QUERY = gql`
  query {
    standings {
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

// Keeping this for future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DATED_STANDINGS_QUERY = gql`
  query {
    standings(date: "2023-03-01") {
      otWins
      internationalSystemPoints
      teamName
      points
      wins
      regulationWins
      losses
      otLosses
    }
  }
`;

export const fetchStandings = async () => {
  try {
    const result = await client.query(STANDINGS_QUERY, {});
    if (result.error) {
      console.error('Error fetching standings:', result.error);
    }
    if (result?.data.length === 0) {
      console.error('Retrieved empty standings');
    }
    return result.data.standings;
  } catch (error) {
    console.error('Error fetching standings:', error);
    return [];
  }
};

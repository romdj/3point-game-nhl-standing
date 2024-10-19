import { client } from './graphqlClient';
import { gql } from '@urql/svelte';

const STANDINGS_QUERY = gql`
  query {
    standings {
      team
      gamesPlayed
      wins
      otWins
      points
    }
  }
`;

export const fetchStandings = async () => {
  const result = await client.query(STANDINGS_QUERY).toPromise();
  return result.data.standings;
};

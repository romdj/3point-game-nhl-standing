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
    }
  }
`;

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
  console.log('fetching standings');
  console.log(`client: ${JSON.stringify(client)}`);
  try {
    const result = await client.query(STANDINGS_QUERY, {});
    if (result.error) {
      console.error('Error fetching standings:', result.error);
    }
    console.log(`results: ${result}`);
    console.log(`results standings: ${result.data.standings}`);
    return result.data.standings;
  } catch (error) {
    // if (result.error) {
    // console.error('Error fetching standings:', result.error);
    // }
    console.error('Error fetching standings:', error);
    return [];

  }
  // console.log(`results: ${result}`);
  // return result.data.standings;

  // const result2 = await client.query(DATED_STANDINGS_QUERY, {date: new Date().toISOString().split('T')[0]} ).toPromise();
};

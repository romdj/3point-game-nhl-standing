import {
    fetchNHLSchedule,
    getGamesFromSchedule,
    getTeamsFromSchedule,
    get3PointStandings,
    sortStandings
} from './fetch/fetch.js'
// import { storeMatch, storeTeam } from './store/documentdb/aws/dynamodb.js';

export async function main() {
    const nhlSchedule = await fetchNHLSchedule();

    const games = await getGamesFromSchedule(nhlSchedule);
    const teams = await getTeamsFromSchedule(games);
    const teamsWithPoints = await get3PointStandings(teams, games);

    // teamsWithPoints.map(async team => await storeTeam(team));
    // games.map(async game => await storeMatch(game));

    console.log(sortStandings(teamsWithPoints));
    // console.log(sortStandings(teamsWithPoints));
    // return sortStandings(teamsWithPoints);
}
// main();
main().then(sortedStanding => console.log(sortedStanding));
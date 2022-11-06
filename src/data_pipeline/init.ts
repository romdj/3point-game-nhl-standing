import { Game } from './compute/domain/game.js';
import { TeamInformation } from './compute/domain/teamInformation.js';
import {
    fetchNhlGamesSchedule,
    getCompletedGamesFromSchedule,
    getTeamsFromSchedule,
    get3PointStandings,
    sortStandings
} from './fetch/fetch.js'
import { storeMatch, storeTeam } from './store/documentdb/aws/dynamodb.js';

export async function main() {
    const nhlGames = await fetchNhlGamesSchedule();
    // console.log(nhlSchedule);


    const ingestedGames = await getCompletedGamesFromSchedule(nhlGames);
    console.log(ingestedGames);

    ingestedGames
        .forEach(async (game: Game) => await storeMatch(game));

    // const teams = await getTeamsFromSchedule(games);
    // teams.forEach(async (team: TeamInformation) => await storeTeam(team));

    /* 
    const teamsWithPoints = await get3PointStandings(teams, games);
    // teamsWithPoints.map(async team => await storeTeam(team));
    // games.map(async game => await storeMatch(game));
    console.log(sortStandings(teamsWithPoints));
    // console.log(sortStandings(teamsWithPoints));
    // return sortStandings(teamsWithPoints);


 */
}
main().then(sortedStanding => console.log('done storing games'));
// main().then(sortedStanding => console.log(games));

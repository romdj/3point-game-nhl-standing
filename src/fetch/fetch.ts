import * as rq from "request-promise-native";
import { Game } from './domain/game';
import { LeagueRecord } from "./domain/leagueRecord";
import { TeamInformation } from "./domain/teamInformation";
import { ScheduleSeasonParser } from './model/scheduleSeasonParser';
import moment = require('moment');
import { writeFileSync, appendFileSync } from "fs";


const fetchNHLSchedule = async () => {
  const intervalStartDate: string = '2020-02-01';
  const season: string = getCurrentSeason();
  const intervalEndDate: string = moment().format("YYYY-MM-DD");
  // const intervalEndDate: string = '2020-03-01';
  const nhlAPIURL: string = "https://statsapi.web.nhl.com/api/v1/";
  const from: string = `?startDate=${intervalStartDate}`;
  const to: string = `&endDate=${intervalEndDate}`;
  const nhlCompleteScheduleURL: string = `${nhlAPIURL}schedule${from}${to}&expand=schedule.linescore&season=${season}`;
  const nhlStandingsURL: string = `${nhlAPIURL}standings?season=${season}`;

  return await rq.get(nhlCompleteScheduleURL);
}

const getGamesFromSchedule = async (schedule: any) => {
  const result = JSON.parse(schedule);
  const { dates } = result;
  const NHLDownstreamGames = dates.map((item: any) => item.games).flat();
  const regularSeasonGames = new ScheduleSeasonParser(NHLDownstreamGames).regularSeasonGames;
  return regularSeasonGames.map((game: any) => new Game(game));
}

const getTeamsFromSchedule = async (games: any) => {
  return Array.from(new Set([...games.map((game: any) => game.winnerId), ...games.map((game: any) => game.loserId)]))
    .filter(teamId => teamId !== '');
}

const get3PointStandings = async (team: any, games: any): Promise<TeamInformation> => {
  // teams.map(async (team: string) => {
    let points = 0;
    let record: LeagueRecord = new LeagueRecord();
    games
      .filter((game: Game) => game.winnerId === team || game.loserId === team)
      .forEach((currentGame: Game) => {
        currentGame.addRecord(team, record);
        points += currentGame.getPoint(team);
      });
    const tInfo = new TeamInformation(team, record);
    await tInfo.fillTeamInfo();
    return tInfo;
    // teamsWithPoints.push(Object.assign({}, tInfo));
  // });
}

const sortStandings = async (teams: Array<TeamInformation>) => {
  return teams.sort((a: TeamInformation, b: TeamInformation) => b.record.points - a.record.points);
}
// .reduce((accumulator, currentGame) => {
//   return accumulator.getPoint(team) + currentGame.getPoint(team);
// });

const getCurrentSeason = () => {
  if (moment().month() >= 9 && moment().month() <= 12)
    return `${moment().year()}${moment().year() + 1}`;
  return `${moment().year() - 1}${moment().year()}`;
};

exports.handler = async function (event: any, context: any) {
}
const main = async () => {
  const nhlSchedule = await fetchNHLSchedule();
  const games = await getGamesFromSchedule(nhlSchedule);
  const teams = await getTeamsFromSchedule(games);
  const teamsWithPoints: TeamInformation[] = [];
  teams.map(async (team: any) => {
    teamsWithPoints.push(await get3PointStandings(team, games));
  });
  return sortStandings(teamsWithPoints);
}
// main();
main().then(sortedStanding => console.log(sortedStanding));

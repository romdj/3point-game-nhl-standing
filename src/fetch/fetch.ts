import * as rq from "request-promise-native";
import { Game } from './domain/game';
import { LeagueRecord } from "./domain/leagueRecord";
import { fillTeamInfo, TeamInformation } from "./domain/teamInformation";
import { ScheduleSeasonParser } from './model/scheduleSeasonParser';
import moment = require('moment');
import { writeFileSync } from "fs";


const fetchNHLSchedule = async () => {
  const intervalStartDate: string = '2020-02-01';
  const season: string = getCurrentSeason();
  const intervalEndDate: string = moment().format("YYYY-MM-DD");
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

const get3PointStandings = async (teams: any, games: any) => {
  const teamsWithPoints: TeamInformation[] = [];
  await teams.forEach(async (team: string) => {
    let points = 0;
    let record: LeagueRecord = new LeagueRecord();
    games
      .filter((game: Game) => game.winnerId === team || game.loserId === team)
      .forEach((currentGame: Game) => {
        currentGame.addRecord(team, record);
        points += currentGame.getPoint(team);
      });
    const tInfo = new TeamInformation(team, record);
    await fillTeamInfo(tInfo)
      .then(_ => console.log(0))
      .then(_ => teamsWithPoints.push(tInfo))
      .then(_ => writeFileSync('./teamStanding.json', JSON.stringify(teamsWithPoints), 'utf8'));
  });
  return teamsWithPoints;
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
  await fetchNHLSchedule();
  return 'ok';
}

async () => {
  const nhlSchedule = await fetchNHLSchedule();
  const games = getGamesFromSchedule(nhlSchedule);
  const teams = getTeamsFromSchedule(games);
  const unsortedStandings = get3PointStandings(teams, games);
  const sortedStandings = (unsortedStandings);
}
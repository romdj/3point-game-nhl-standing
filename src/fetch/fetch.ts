import * as rq from "request-promise-native";
import { Game } from './domain/game';
import { LeagueRecord } from "./domain/leagueRecord";
import { TeamInformation } from "./domain/teamInformation";
import { ScheduleSeasonParser } from './model/scheduleSeasonParser';
import moment = require('moment');
const nhlAPIURL: string = "https://statsapi.web.nhl.com/api/v1/";


export const fetchNHLSchedule = async (season?: string) => {
  const seasonInUse: string = season ? season : getCurrentSeason();
  const intervalStartDate: string = `${seasonInUse.slice(0, 4)}-09-01`;
  const intervalEndDate: string = `${seasonInUse.slice(4, 8)}-09-01`;
  const from: string = `?startDate=${intervalStartDate}`;
  const to: string = `&endDate=${intervalEndDate}`;
  const nhlCompleteScheduleURL: string = `${nhlAPIURL}schedule${from}${to}&expand=schedule.linescore&season=${seasonInUse}`;
  return await rq.get(nhlCompleteScheduleURL);
}

export const getSeasonStanding = async (season?: string) => {
  const seasonInUse: string = season ? season : getCurrentSeason();
  return await rq.get(`${nhlAPIURL}standings?season=${seasonInUse}`);
};

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
const get3PointStandings = async (teams: any, games: any): Promise<Array<TeamInformation>> => {
  const teamsWithPoints: TeamInformation[] = [];
  await teams.forEach(async (team: any) => {
    const something: TeamInformation = await buildTeamInformation(team, games);
    teamsWithPoints.push(something);
  });
  return teamsWithPoints;
}
const buildTeamInformation = async (team: any, games: any): Promise<TeamInformation> => {
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

export const games = async (nhlSchedule: any) => await getGamesFromSchedule(nhlSchedule);
export const teams = async (games: Game[]) => await getTeamsFromSchedule(games);
export const teamsWithPoints = async (teams: TeamInformation[], games: Game[]) => await get3PointStandings(teams, games);

export const getCompleteStandings = async () => {
  const nhlSchedule = await fetchNHLSchedule();
  const games = await getGamesFromSchedule(nhlSchedule);
  const teams = await getTeamsFromSchedule(games);
  const teamsWithPoints = await get3PointStandings(teams, games);
  return sortStandings(teamsWithPoints);
}

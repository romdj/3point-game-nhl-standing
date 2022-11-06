// import got from "got";
// import {WritableStream} from "stream";
// import https from "https";
const axios = require('axios');
const moment = require('moment');

import { Game, Match } from '../compute/domain/game.js';
import { LeagueRecord } from "../compute/domain/leagueRecord.js";
import { TeamInformation } from "../compute/domain/teamInformation.js";
import { NhlDate } from '../compute/model/NhlDate.js';
import { NhlGame } from '../compute/model/NhlGame.js';
import { NhlScheduleResponse } from '../compute/model/NhlScheduleResponse.js';
import { ScheduleSeasonParser } from '../compute/model/scheduleSeasonParser.js';

export async function fetchNhlGamesSchedule(season?: string): Promise<NhlGame[]> {
  season = season || getCurrentSeason();
  // const fromYear = season.slice(0, 4);
  // const toYear = season.slice(4, 8);

  const intervalStartDate: string = '2022-10-01';
  const intervalEndDate: string = moment().format("YYYY-MM-DD");
  // const intervalEndDate: string = '2020-03-01';

  const nhlAPIURL: string = "https://statsapi.web.nhl.com/api/v1/";
  const from: string = `?startDate=${intervalStartDate}`;
  const to: string = `&endDate=${intervalEndDate}`;

  const nhlCompleteScheduleURL: string = `${nhlAPIURL}schedule${from}${to}&expand=schedule.linescore&season=${season}`;
  const nhlStandingsURL: string = `${nhlAPIURL}standings?season=${season}`;

  const completeScheduleResponse = await axios.get(nhlCompleteScheduleURL);
  const completeSchedule: Array<NhlGame> = completeScheduleResponse.data.dates
    .flat()
    .map((nhlDate: NhlDate) => nhlDate.games)
    .flat();

  return completeSchedule;
}

export async function getCompletedGamesFromSchedule(nhlGames: NhlGame[]) {

  // console.log(schedule);
  // const result = JSON.parse(schedule);
  // const { dates } = result;
  // const NHLDownstreamGames = dates.map((item: any) => item.games).flat();
  // const regularSeasonGames = new ScheduleSeasonParser(NHLDownstreamGames).regularSeasonGames;
  return nhlGames
    .filter((game: NhlGame) => game.gameType === 'R')
    .filter((game: NhlGame) => game.status.detailedState === 'Final')
    .map((game: NhlGame) => new Game(game));
}

export async function getTeamsFromSchedule(games: any) {
  return Array.from(new Set([...games.map((game: any) => game.winnerId), ...games.map((game: any) => game.loserId)]))
    .filter(teamId => teamId !== '');
}

export async function get3PointStandings(teams: any, games: any): Promise<Array<TeamInformation>> {
  const teamsWithPoints: TeamInformation[] = [];
  await teams.forEach(async (team: any) => {
    const something: TeamInformation = await buildTeamInformation(team, games);
    // console.log(`something: ${JSON.stringify(something, null, 2)}`);
    teamsWithPoints.push(something);
  });
  console.log(2);
  return teamsWithPoints;
}

export async function buildTeamInformation(team: any, games: any): Promise<TeamInformation> {
  // teams.map(async (team: string) => {
  let points = 0;
  let record: LeagueRecord = new LeagueRecord();
  games
    .filter((game: Game) => game.winnerId === team || game.loserId === team)
    .forEach((currentGame: Game) => {
      currentGame.addRecord(team, record);
      points += currentGame.getPoint(team);
    });
  console.log(games);
  const tInfo = new TeamInformation(team, record);
  await tInfo.fillTeamInfo();
  // console.log(JSON.stringify(tInfo));
  return tInfo;
  // teamsWithPoints.push(Object.assign({}, tInfo));
  // });
}

export async function sortStandings(teams: Array<TeamInformation>) {
  return teams.sort((a: TeamInformation, b: TeamInformation) => b.record.points - a.record.points);
}
// .reduce((accumulator, currentGame) => {
//   return accumulator.getPoint(team) + currentGame.getPoint(team);
// });

export const getCurrentSeason = () => {
  if (moment().month() >= 9 && moment().month() <= 12)
    return `${moment().year()}${moment().year() + 1}`;
  return `${moment().year() - 1}${moment().year()}`;
};

exports.handler = async function (event: any, context: any) {
}

import * as rq from "request-promise-native";
import moment = require('moment');

import { Game } from './domain/game';
import { LeagueRecord } from "./domain/leagueRecord";
import { ScheduleSeasonParser } from './model/scheduleSeasonParser';
import { TeamInformation, fillTeamInfo } from "./domain/teamInformation";

const intervalStartDate: string = '2019-09-01';
const season: string = '20192020';
const intervalEndDate: string = moment().format("YYYY-MM-DD");
const nhlAPIURL: string = "https://statsapi.web.nhl.com/api/v1/";
const from: string = `?startDate=${intervalStartDate}`;
const to: string = `&endDate=${intervalEndDate}`;
const nhlCompleteScheduleURL: string = `${nhlAPIURL}schedule${from}${to}&expand=schedule.linescore&season=${season}`;
const nhlStandingsURL: string = `${nhlAPIURL}standings?season=${season}`;

rq.get(nhlCompleteScheduleURL)
  .then(async value => {
    const result = JSON.parse(value);
    const { dates } = result;
    const NHLDownstreamGames = dates.map((item: any) => item.games).flat();
    const regularSeasonGames = new ScheduleSeasonParser(NHLDownstreamGames).regularSeasonGames;
    const games: Array<Game> = regularSeasonGames.map((game: any) => new Game(game));
    const teams = Array.from(new Set([...games.map((game: any) => game.winnerId), ...games.map((game: any) => game.loserId)]));

    const teamsWithPoints: TeamInformation[] = [];
    teams.forEach(async (team: string) => {
      let points = 0;
      let record: LeagueRecord = new LeagueRecord();
      games
        .filter((game: Game) => game.winnerId === team || game.loserId === team)
        .forEach((currentGame: Game) => {
          currentGame.addRecord(team, record);
          points += currentGame.getPoint(team);
        });
      const tInfo = new TeamInformation(team, record);
      await fillTeamInfo(tInfo).then(_ => teamsWithPoints.push(tInfo));
    });
    console.log(teamsWithPoints.sort((a: TeamInformation, b: TeamInformation) => b.record.points - a.record.points));

    // .reduce((accumulator, currentGame) => {
    //   return accumulator.getPoint(team) + currentGame.getPoint(team);
    // });
  });

// import * as moment from "moment";
import * as rq from "request-promise-native";
import { writeFileSync } from "fs";
import moment = require('moment');

// import {ScheduleSeasonParser} =require  './scheduleSeasonParser';
import { ScheduleSeasonParser } from './scheduleSeasonParser';
import { Game } from '../domain/game';
import { WinType } from "../domain/wintype";
import { TeamInformation } from "../domain/teamInformation";
import { LeagueRecord } from "../domain/leagueRecord";

const intervalStartDate: string = '2019-09-01';
const season: string = '20192020';
const intervalEndDate: string = moment().format("YYYY-MM-DD");
const nhlAPIURL: string = "https://statsapi.web.nhl.com/api/v1/";
const from: string = `?startDate=${intervalStartDate}`;
const to: string = `&endDate=${intervalEndDate}`;
const nhlCompleteScheduleURL: string = `${nhlAPIURL}schedule${from}${to}&expand=schedule.linescore&season=${season}`;
const nhlStandingsURL: string = `${nhlAPIURL}standings?season=${season}`;
// const nhlStandingsURL: string = `${nhlAPIURL}standings?season=${season}&expand=standings.record`;


rq.get(nhlCompleteScheduleURL)
  .then(value => {
    const result = JSON.parse(value);
    const { dates } = result;
    const NHLDownstreamGames = dates.map((item: any) => item.games).flat();

    // console.log(`number of games found for the period between ${intervalStartDate} and ${intervalEndDate}: ${NHLDownstreamGames.length}`);

    const regularSeasonGames = new ScheduleSeasonParser(NHLDownstreamGames).regularSeasonGames;
    const games: Array<Game> = regularSeasonGames.map((game: any) => new Game(game));
    const teams = Array.from(new Set([...games.map((game: any) => game.winnerId), ...games.map((game: any) => game.loserId)]));

    console.log(teams);

    const teamStructExample = {
      teamName: 'string',
      points: 12
    };

    const teamsWithPoints: any[] = [];
    teams.forEach((team: string) => {
      let score = 0;
      let record: LeagueRecord = new LeagueRecord();
      games
        .filter((game: Game) => game.winnerId === team || game.loserId === team)
        .forEach((currentGame: Game) => {
          currentGame.addRecord(team, record);
          score += currentGame.getPoint(team);
        });
      teamsWithPoints.push({
        name: team,
        points: score,
        record
      });
    });
    console.log(teamsWithPoints.sort((a: any, b: any) => b.points - a.points));
    // rq.get(nhlStandingsURL).then((something: any) => console.log(something));

    // .reduce((accumulator, currentGame) => {
    //   return accumulator.getPoint(team) + currentGame.getPoint(team);
    // });
    // .values(_ => game.getPoint(team))
    // .forEach(game => game.getPoint(team))
  });

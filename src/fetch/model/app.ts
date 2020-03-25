// import * as moment from "moment";
import * as rq from "request-promise-native";
import { writeFileSync } from "fs";
import moment = require('moment');

// import {ScheduleSeasonParser} =require  './scheduleSeasonParser';
import { ScheduleSeasonParser } from './scheduleSeasonParser';
import { Game } from '../domain/game';

const intervalStartDate: string = '2019-09-01';
const intervalEndDate: string = moment().format("YYYY-MM-DD");
const nhlAPIURL: string = "https://statsapi.web.nhl.com/api/v1/";
const from: string = `?startDate=${intervalStartDate}`;
const to: string = `&endDate=${intervalEndDate}`;
const nhlCompleteScheduleURL: string = `${nhlAPIURL}schedule${from}${to}&expand=schedule.linescore&season=20192020`;


rq.get(nhlCompleteScheduleURL).then(value => {
  const result = JSON.parse(value);
  const { dates } = result;
  const NHLDownstreamGames = dates.map((item: any) => item.games).flat();

  // console.log(`number of games found for the period between ${intervalStartDate} and ${intervalEndDate}: ${NHLDownstreamGames.length}`);

  const regularSeasonGames = new ScheduleSeasonParser(NHLDownstreamGames).regularSeasonGames;
  const games: Array<Game> = regularSeasonGames.map((game:any) => new Game(game));
  console.log(games);
});



// import * as moment from "moment";
import * as rq from "request-promise-native";
import { writeFileSync } from "fs";

import moment = require('moment');


const nhlAPIURL = "https://statsapi.web.nhl.com/api/v1/";
const from = "?startDate=2019-12-31";
const to = `&endDate=${moment().format("YYYY-MM-DD")}`;
const nhlCompleteScheduleURL = `${nhlAPIURL}schedule${from}${to}&expand=schedule.linescore&season=20192020`;

rq.get(nhlCompleteScheduleURL).then(value => {
  const result = JSON.parse(value);
  const { dates } = result;
  const games: any = dates.map((item: any) => item.games).flat();
  // const gameIds = dates.map(item => item.games.map(game => game.gamePk)).flat();

  writeFileSync("data/result.json", JSON.stringify(games, null, 2), "utf8");

  /** 
 * The first 4 digits identify the season of the game (ie. 2017 for the 2017-2018 season).
 * The next 2 digits give the type of game, where: 
 * 01 = preseason
 * 02 = regular season
 * 03 = playoffs
 * 04 = all-star.
 * 
 * The final 4 digits identify the specific game number.
 * For regular season and preseason games, this ranges from 0001 to the number of games played.
 * (1271 for seasons with 31 teams (2017 and onwards) and 1230 for seasons with 30 teams).
 * 
 * For playoff games, the 2nd digit of the specific number gives the round of the playoffs, the 3rd digit specifies the matchup, and the 4th digit specifies the game (out of 7).

 */
});

// import * as moment from "moment";
import * as rq from "request-promise-native";
import { writeFileSync } from "fs";
import moment = require('moment');

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
  // const gameIds = dates.map(item => item.games.map(game => game.gamePk)).flat();

  console.log(`number of games found for the period between ${intervalStartDate} and ${intervalEndDate}: ${NHLDownstreamGames.length}`);
  const keys: Array<string> = NHLDownstreamGames.map((game: any) => game.gamePk);
  // console.log(keys);

  const preseasonRegex = /[0-9]{4}01[0-9]{4}/;
  const regseasonRegex = /[0-9]{4}02[0-9]{4}/;
  const playoffRegex = /[0-9]{4}03[0-9]{4}/;
  const all_starRegex = /[0-9]{4}04[0-9]{4}/;
  const PreSeasonGames = NHLDownstreamGames.filter((game: any) => preseasonRegex.test(game.gamePk)); 
  const RegularSeasonGames = NHLDownstreamGames.filter((game: any) => regseasonRegex.test(game.gamePk));
  
  const CompletedRegularSeasonGames = RegularSeasonGames.filter((game: any) => isComplete(game));
  const RegulationRegularSeasonGames = RegularSeasonGames.filter((game: any) => isRegulation(game));
  const OvertimeRegularSeasonGames = RegularSeasonGames.filter((game: any) => isOvertime(game));
  const ShootoutRegularSeasonGames = NHLDownstreamGames.filter((game: any) => isShootout(game));

  // const PlayoffGames = NHLDownstreamGames.filter((game: any) => playoffRegex.test(game.gamePk));
  // const All_StarGames = NHLDownstreamGames.filter((game: any) => all_starRegex.test(game.gamePk));


  // console.log(`Number of PreSeason games played : ${PreSeasonGames.length}`);
  console.log(`Number of Regular Season games played : ${RegularSeasonGames.length}`);
  // console.log(`Number of Playoff games played : ${PlayoffGames.length}`);
  // console.log(`Number of All Star games played : ${All_StarGames.length}`);

  console.log(`Number of Regular Season games  / Complete: ${RegularSeasonGames.length} / ${CompletedRegularSeasonGames.length}`);
  console.log(`Number of Regulation Regular Season games played : ${RegulationRegularSeasonGames.length}`);
  console.log(`Number of OverTime Regular Season games played : ${OvertimeRegularSeasonGames.length}`);
  console.log(`Number of Shootout Regular Season games played : ${ShootoutRegularSeasonGames.length}`);


  // writeFileSync("data/result.json", JSON.stringify(NHLDownstreamGames, null, 2), "utf8");

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

const isComplete = (game: any): boolean => {
  return game.linescore.currentPeriodTimeRemaining === 'Final';
}

const isRegulation = (game: any): boolean => {
  return game.linescore.currentPeriodOrdinal === '3rd' && game.linescore.currentPeriodTimeRemaining === 'Final';
}

const isOvertime = (game: any): boolean => {
  return game.linescore.currentPeriodOrdinal == 'OT' && game.linescore.currentPeriodTimeRemaining == 'Final';
}

const isShootout = (game: any): boolean => {
  return game.linescore.currentPeriodOrdinal == 'SO' && game.linescore.currentPeriodTimeRemaining == 'Final';
}
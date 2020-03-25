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

  console.log(`number of games found for the period between ${intervalStartDate} and ${intervalEndDate}: ${NHLDownstreamGames.length}`);



  console.log(`other games : ${JSON.stringify(RegularSeasonGames.filter((game: any) => !isComplete(game)))}`);
  writeFileSync("data/others.json", JSON.stringify(RegularSeasonGames.filter((game: any) => !isComplete(game)), null, 2), "utf8");

  // console.log(`Number of PreSeason games played : ${PreSeasonGames.length}`);
  console.log(`Number of Regular Season games played : ${RegularSeasonGames.length}`);
  // console.log(`Number of Playoff games played : ${PlayoffGames.length}`);
  // console.log(`Number of All Star games played : ${All_StarGames.length}`);

  console.log(`Number of Regular Season games  / Complete: ${RegularSeasonGames.length} / ${CompletedRegularSeasonGames.length}`);
  console.log(`Number of Regulation Regular Season games played : ${RegulationRegularSeasonGames.length}`);
  console.log(`Number of OverTime Regular Season games played : ${OvertimeRegularSeasonGames.length}`);
  console.log(`Number of Shootout Regular Season games played : ${ShootoutRegularSeasonGames.length}`);


  // writeFileSync("data/result.json", JSON.stringify(NHLDownstreamGames, null, 2), "utf8");


});

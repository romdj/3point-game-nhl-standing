/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const fetch = require(`node-fetch`)
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2017',
  },
})

exports.fetchHelper = require('./src/fetch/fetch');
exports.sourceNodes = async ({
  actions: { createNode },
  createContentDigest,
}) => {
  // get data from GitHub API at build time
  // const nhlAPIURL = "https://statsapi.web.nhl.com/api/v1/";
  // const from = '?startDate=2019-09-01';
  // const to = '&endDate=2020-03-01';
  // const season = '20192020';
  // const nhlStandingsURL = `${nhlAPIURL}standings?season=${season}`;
  // nhlCompleteScheduleURL = `${nhlAPIURL}schedule${from}${to}&expand=schedule.linescore&season=${season}`;
  // // const result = await rq.get(nhlCompleteScheduleURL);
  // const result = await fetch(nhlCompleteScheduleURL);

  // const days = await result.json();
  // const games = 
  // console.log(JSON.stringify(days));
  // create node for build time data example in the docs
  const schedule = await this.fetchHelper.fetchNHLSchedule();
  const games = await this.fetchHelper.games(schedule);
  const teams = await this.fetchHelper.teams(games);
  const teamsWithPoints = await this.fetchHelper.teamsWithPoints(teams, games);
  console.log(`schedule: ${JSON.stringify(schedule, null, 2)}`);
  console.log(`games: ${JSON.stringify(games, null, 2)}`);
  console.log(`teams: ${JSON.stringify(teams, null, 2)}`);
  console.log(teamsWithPoints);
  createNode({
    // nameWithOwner and url are arbitrary fields from the data
    nameWithOwner: resultData.full_name,
    url: resultData.html_url,
    // required fields
    id: `example-build-time-data`,
    parent: null,
    children: [],
    internal: {
      type: `Example`,
      contentDigest: createContentDigest(resultData),
    },
  })
}
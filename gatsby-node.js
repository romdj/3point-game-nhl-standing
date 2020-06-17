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
}) => {
  const schedule = await this.fetchHelper.fetchNHLSchedule();
  const games = await this.fetchHelper.games(schedule);
  const teams = await this.fetchHelper.teams(games);
  const teamsWithPoints = await this.fetchHelper.teamsWithPoints(teams, games);

  createNode({
    id: 'someId-1234-5678',
    parent: null,
    children: [...games],
    internal: {
      contentDigest: `createContentDigest(resultData)`,
      type: 'Game'
    },
  });
  createNode({
    // nameWithOwner and url are arbitrary fields from the data
    nameWithOwner: 'SomeOwner1',
    url: 'https://www.yousendit.com',
    // required fields
    id: `id001`,
    parent: null,
    children: [],
    internal: {
      type: `Example001`,
      contentDigest: `createContentDigest(resultData)`,
    },
  })
}
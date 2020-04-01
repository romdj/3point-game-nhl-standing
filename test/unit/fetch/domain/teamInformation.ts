import 'mocha';
// import sinon from 'sinon';
import jest from 'jest';
import * as rq from "request-promise-native";
import { expect } from 'chai';

jest.mock('rq');

import { TeamInformation } from "../../../../src/fetch/domain/TeamInformation";
import { LeagueRecord } from '../../../../src/fetch/domain/leagueRecord';

const dummyRegGameData = require("../../data/dummy-game.json");
const dummyOTGameData = require("../../data/dummy-ot-game.json");
const dummySOGameData = require("../../data/dummy-so-game.json");

const teamInfoResponse = require("../../data/teamInfoResponse.json");

function get(url) {
  return new Promise((resolve, reject) => {
    const teamID = url.split('/').pop();
    process.nextTick(() =>
      teamInfoResponse[teamID]
        ? resolve(teamInfoResponse[teamID])
        : reject({
          error: `Team with ${teamID} not found.`,
        }),
    );
  });
}

before(() => {
  rq.get.mockImplementation((url: any) => get(url));
});
after(() => {

});
// const sandbox = sinon.createSandbox();
describe('Team Information', () => {

  const mockSeasonCal = [dummyRegGameData, dummyOTGameData, dummySOGameData];
  const teamIds: Array<string> = ['10', '9', '15', '19', '12', '8'];

  before(() => {
    // const team = { id: 'something' };
    // const nhlUrl = `https://statsapi.web.nhl.com/api/v1/teams/${team.id}`;
    // sandbox.stub(rq, 'get').returns(baseRequest.id);
    // sandbox.mock(rq, 'get', async (url: string, callback: any) => {
    // const id = url.split('/').pop();

    // return teamInfoResponse[id];
    // });
    // export default function get(url) {

    after(() => {
      // sandbox.restore();
    });
  });
  describe('Team Information', () => {
    it('Creating Valid Record for NHL Team', () => {
      const dummyRecord: LeagueRecord = new LeagueRecord();
      const teamInfo = new TeamInformation('10', dummyRecord);

    });

    it.skip("Creating team Info with teamId not in the resource object to make sure we're calling the mocked API", () => {
      const dummyRecord: LeagueRecord = new LeagueRecord();
      const teamInfo = new TeamInformation('10', dummyRecord);
    });
  });
});
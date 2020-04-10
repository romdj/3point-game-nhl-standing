import 'mocha';
// import * as jest from 'jest';
import * as request from "request-promise-native";
import { expect } from 'chai';

import { TeamInformation } from "../../../../src/fetch/domain/TeamInformation";
import { LeagueRecord } from '../../../../src/fetch/domain/leagueRecord';

//   SearchSource: [Getter],
//   TestScheduler: [Getter],
//   TestWatcher: [Getter],
//   getVersion: [Getter],
//   runCLI: [Getter],
//   run:
// console.log(new jest.SearchSource().;
// console.log(jest.TestScheduler);
// console.log(jest.TestWatcher);
// console.log(jest.getVersion());
// console.log(jest.runCLI());
// console.log(jest.run);
// jest.mock('request-promise-native', () => {
//   return {
//     post: jest.fn()
//   };
// });

const dummyRegGameData = require("../../data/dummy-game.json");
const dummyOTGameData = require("../../data/dummy-ot-game.json");
const dummySOGameData = require("../../data/dummy-so-game.json");

const teamInfoResponse = require("../../data/teamInfoResponse.json");

function get(url: any) {
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
  // rq.get.mockImplementation((url: any) => get(url));
});
afterEach(() => {
});
after(() => {

});
// const sandbox = sinon.createSandbox();
describe.only('Team Information', () => {
  console.log(jest);
  console.log(JSON.stringify(jest, null,2 ));
  const mockSeasonCal = [dummyRegGameData, dummyOTGameData, dummySOGameData];
  const teamIds: Array<string> = ['10', '9', '15', '19', '12', '8'];

  before(() => {
    // const team = { id: 'something' };
    // const nhlUrl = `https://statsapi.web.nhl.com/api/v1/teams/${team.id}`;
    // const id = url.split('/').pop();

    // return teamInfoResponse[id];
    // });
    // export default function get(url) {


    // const postSpy = jest.spyOn(request, 'get').mockResolvedValue({ success: true });

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
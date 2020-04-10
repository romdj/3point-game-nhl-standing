import 'mocha';
// import * as jest from 'jest';
import { mocked } from 'ts-jest/utils'
import * as rq from "request-promise-native";
import { expect } from 'chai';

jest.mock('rq');

import { TeamInformation } from './teamInformation';
import { LeagueRecord } from './leagueRecord';


before(() => { });
after(() => { });

beforeEach(() => {
  require('rq').__setMockFiles();
});
afterEach(() => { });

describe('Team Information', () => {
  console.log(jest);
  console.log(JSON.stringify(jest, null, 2));
  const teamIds: Array<string> = ['10', '9', '15', '19', '12', '8'];

  describe('Team Information', () => {
    it('Creating Valid Record for NHL Team', () => {
      const dummyRecord: LeagueRecord = new LeagueRecord();
      const teamInfo = new TeamInformation(teamIds[0], dummyRecord);
      expect(teamInfo.id).to.equal(teamIds[0]);
      console.log(teamInfo);
      // const a = mocked./ TO BE FINISHED
    });

    it.skip("Creating team Info with teamId not in the resource object to make sure we're calling the mocked API", () => {
      const dummyRecord: LeagueRecord = new LeagueRecord();
      const teamInfo = new TeamInformation('10', dummyRecord);
    });
  });
});
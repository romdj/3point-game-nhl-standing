import 'mocha';

import { mocked } from 'ts-jest/utils'
import { expect } from 'chai';

jest.mock('request-promise-native');
console.log('TeamInformation');
import { TeamInformation } from './teamInformation';
console.log('LeagueRecord');
import { LeagueRecord } from './leagueRecord';


beforeEach(() => {
  require('request-promise-native').__setMockFiles();
});

describe('Team Information', () => {
  const teamIds: Array<string> = ['10', '9', '15', '19', '12', '8'];

  describe('Team Information', () => {
    it('Creating Valid NHL Team', () => {
      const dummyRecord: LeagueRecord = new LeagueRecord();
      const teamInfo = new TeamInformation(teamIds[0], dummyRecord);
      expect(teamInfo.id).to.equal(teamIds[0]);
    });

    it.skip("Creating team Info with teamId not in the resource object to make sure we're calling the mocked API", () => {
      const dummyRecord: LeagueRecord = new LeagueRecord();
      const teamInfo = new TeamInformation('10', dummyRecord);
    });
  });
});
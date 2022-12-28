import { beforeEach, describe, expect, it } from '@jest/globals';

import { LeagueRecord } from './leagueRecord.js';
import { TeamInformation } from './teamInformation.js';

// jest.mock('got');

beforeEach(() => {
  require('got').__setMockFiles();
});

describe('Team Information', () => {
  const teamIds: Array<string> = ['10', '9', '15', '19', '12', '8'];

  describe('Team Information', () => {
    it.skip('Creating Valid NHL Team', () => {
      const dummyRecord: LeagueRecord = new LeagueRecord();
      const teamInfo = new TeamInformation(teamIds[0], dummyRecord);
      expect(teamInfo.id).toEqual(teamIds[0]);
    });

    it.skip("Creating team Info with teamId not in the resource object to make sure we're calling the mocked API", () => {
      const dummyRecord: LeagueRecord = new LeagueRecord();
      const teamInfo = new TeamInformation('10', dummyRecord);
    });

    it.skip("Creating team Info with teamId not in the resource object to make sure we're calling the mocked API", () => {
    });

  });
});
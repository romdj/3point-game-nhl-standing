import {get} from 'https';
import { LeagueRecord } from './leagueRecord.js';

export class TeamInformation {
  id: string;
  record: LeagueRecord;
  name?: string;
  fullName?: string;
  acronym?: string;
  conference?: string;
  division?: string;

  constructor(id: string, record: LeagueRecord) {
    this.id = id;
    this.record = record;
  }

  async fillTeamInfo(): Promise<void> {
    const teamAPIURL = `https://statsapi.web.nhl.com/api/v1/teams/${this.id}`;
    const teamResponseData  = await get(teamAPIURL);
    console.log(teamResponseData.on('data',(data) => console.log(data)));
    // teamResponseData.
    
      // .then((teamResponseData: any) => {
        /* const teamInfo = JSON.parse(teamResponseData).teams[0];
        this.acronym = teamInfo.abbreviation;
        this.name = teamInfo.teamName;
        this.fullName = `${teamInfo.locationName} ${teamInfo.teamName}`;
        this.division = teamInfo.division.name;
        this.conference = teamInfo.conference.name; */
      // })
      // .catch((err: any) => Promise.reject(err));
  }
}

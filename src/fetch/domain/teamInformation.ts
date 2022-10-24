import { LeagueRecord } from "./leagueRecord";

import got from "got";

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
    await got.get(teamAPIURL)
      .then((teamResponseData: any) => {
        const teamInfo = JSON.parse(teamResponseData).teams[0];
        this.acronym = teamInfo.abbreviation;
        this.name = teamInfo.teamName;
        this.fullName = `${teamInfo.locationName} ${teamInfo.teamName}`;
        this.division = teamInfo.division.name;
        this.conference = teamInfo.conference.name;
      })
      .catch((err: any) => Promise.reject(err));
  }
}

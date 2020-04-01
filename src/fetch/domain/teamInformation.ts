import * as rq from "request-promise-native";
import { LeagueRecord } from "./leagueRecord";

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
}

export async function fillTeamInfo(team: TeamInformation): Promise<void> {
  const teamAPIURL = `https://statsapi.web.nhl.com/api/v1/teams/${team.id}`;
  await rq.get(teamAPIURL)
    .then((teamResponseData: any) => {
      const teamInfo = JSON.parse(teamResponseData).teams[0];
      team.acronym = teamInfo.abbreviation;
      team.name = teamInfo.teamName;
      team.fullName = `${teamInfo.locationName} ${teamInfo.teamName}`;
      team.division = teamInfo.division.name;
      team.conference = teamInfo.conference.name;
    })
    .catch(err => console.log(`err!: ${err}`));
}

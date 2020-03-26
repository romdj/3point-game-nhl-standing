import { LeagueRecord } from "./leagueRecord";

export class TeamInformation {
  name: string;
  id?: string;
  acronym?: string;
  record: LeagueRecord;

  constructor(name: string, record: LeagueRecord, acronym?: string, id?: string) {
    this.name = name;
    this.id = id;
    this.acronym = acronym;
    this.record = record;
  }
}

export class TeamInformation {
  public name: string;
  public id: string;
  public acronym: string;

  constructor(name: string, acronym: string, id: string) {
    this.name = name;
    this.id = id;
    this.acronym = acronym;
  }
}

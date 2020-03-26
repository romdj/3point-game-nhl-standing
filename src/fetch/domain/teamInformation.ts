export class TeamInformation {
  public name: string;
  public id?: string;
  public acronym?: string;
  public points: number;

  constructor(name: string, points: number, acronym?: string, id?: string) {
    this.name = name;
    this.points = points;
    this.id = id;
    this.acronym = acronym;
  }
}

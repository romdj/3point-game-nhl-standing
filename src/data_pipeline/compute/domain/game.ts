import { NhlGame } from "../model/NhlGame.js";
import { LeagueRecord } from "./leagueRecord.js";
import { WinType } from "./wintype";

export interface Match {
  _id: string;
  gameDate: string;
  winnerId: string;
  loserId: string;
  // winnerTeamName: string;
  // loserTeamName: string;
  winType: WinType;
  pointsW: Number;
  pointsL: Number;
  season: Number;
}
export class Game {
  readonly _id: string;
  readonly gameDate: string;
  readonly winnerId: string;
  readonly loserId: string;
  // readonly winnerTeamName: string;
  // readonly loserTeamName: string;
  readonly winType: WinType;
  readonly pointsW: Number;
  readonly pointsL: Number;
  readonly season: string;
  readonly verboseDescriptionUrl: string;

  constructor(gameNHLSchedule: NhlGame) {
    this._id = `${gameNHLSchedule.gamePk}`;
    this.gameDate = gameNHLSchedule.gameDate;
    this.pointsW = 0;
    this.pointsL = 0;
    this.season = gameNHLSchedule.season;
    this.verboseDescriptionUrl = `https://statsapi.web.nhl.com${gameNHLSchedule.content.link}`;

    if (isPostponed(gameNHLSchedule)) {
      this.winnerId = '';
      this.loserId = '';
      this.winType = WinType.UNDEFINED;
    } else {
      this.winnerId = getWinner(gameNHLSchedule);
      this.loserId = getLoser(gameNHLSchedule);
      this.winType = WinType.UNDEFINED;
      if (isRegulation(gameNHLSchedule)) {
        this.winType = WinType.REGULATION;
        this.pointsW = 3;
        this.pointsL = 0;
      };
      if (isOvertime(gameNHLSchedule)) {
        this.winType = WinType.OVERTIME;
        this.pointsW = 2;
        this.pointsL = 1;
      }
      if (isShootout(gameNHLSchedule)) {
        this.winType = WinType.SHOOTOUT;
        this.pointsW = 2;
        this.pointsL = 1;
      }
      if (this.winType == WinType.UNDEFINED) {
        console.error(`incoming item: ${JSON.stringify(gameNHLSchedule)}`);
        throw new Error('Game has no winner');
      }
    }
  }

  getPoint = (teamId: string): number => {
    if (teamId === this.winnerId) {
      if (this.winType === WinType.REGULATION) return 3;
      return 2;
    }
    if (this.winType === WinType.REGULATION) return 0;
    return 1;
  }

  addRecord = (teamId: string, record: LeagueRecord): void => {
    record.addRecord(teamId === this.winnerId, this.winType);
  }
}

const isComplete = (gameNHLSchedule: any): boolean => {
  return gameNHLSchedule.linescore.currentPeriodTimeRemaining === 'Final' && !isPostponed(gameNHLSchedule);
}

const isRegulation = (gameNHLSchedule: any): boolean => {
  return gameNHLSchedule.linescore.currentPeriodOrdinal === '3rd' && isComplete(gameNHLSchedule);
}

const isOvertime = (gameNHLSchedule: any): boolean => {
  return gameNHLSchedule.linescore.currentPeriodOrdinal === 'OT' && isComplete(gameNHLSchedule);
}

const isShootout = (gameNHLSchedule: any): boolean => {
  return gameNHLSchedule.linescore.currentPeriodOrdinal === 'SO' && isComplete(gameNHLSchedule);
}

const isPostponed = (gameNHLSchedule: any): boolean => {
  return gameNHLSchedule.status.detailedState === 'Postponed';
}

const isHomeWin = (gameNHLSchedule: any): boolean => {
  return gameNHLSchedule.linescore.teams.home.goals > gameNHLSchedule.linescore.teams.away.goals;
}

const getWinner = (gameNHLSchedule: any): string => {
  if (isHomeWin(gameNHLSchedule))
    return `${gameNHLSchedule.linescore.teams.home.team.id}`;
  return `${gameNHLSchedule.linescore.teams.away.team.id}`;
}

const getLoser = (gameNHLSchedule: any): string => {
  if (isHomeWin(gameNHLSchedule))
    return `${gameNHLSchedule.linescore.teams.away.team.id}`;
  return `${gameNHLSchedule.linescore.teams.home.team.id}`;
}

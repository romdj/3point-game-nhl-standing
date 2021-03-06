import { LeagueRecord } from "./leagueRecord";
import { WinType } from "./wintype";

export class Game {
  readonly _id: string;
  readonly winnerId: string;
  readonly loserId: string;
  readonly winType: WinType;

  constructor(gameNHLSchedule: any) {
    this._id = `${gameNHLSchedule.gamePk}`;
    if (isPostponed(gameNHLSchedule)) {
      this.winnerId = '';
      this.loserId = '';
      this.winType = WinType.UNDEFINED;
    } else {
      this.winnerId = getWinner(gameNHLSchedule);
      this.loserId = getLoser(gameNHLSchedule);
      this.winType = WinType.UNDEFINED;
      if (isRegulation(gameNHLSchedule)) this.winType = WinType.REGULATION;
      if (isOvertime(gameNHLSchedule)) this.winType = WinType.OVERTIME;
      if (isShootout(gameNHLSchedule)) this.winType = WinType.SHOOTOUT;
      if (this.winType == WinType.UNDEFINED) {
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

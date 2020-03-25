import { TeamInformation } from "./teamInformation";
import { WinType } from "./wintype";

export class Game {
  readonly _id: string;
  readonly winnerId: string;
  readonly loserId: string;
  readonly winType: WinType;

  constructor(gameNHLSchedule: any) {
    this._id = gameNHLSchedule.gamePk;
    this.winnerId = this.getWinner(gameNHLSchedule);
    this.loserId = this.getLoser(gameNHLSchedule);
    this.winType = WinType.UNDEFINED;
    if (this.isRegulation(gameNHLSchedule)) this.winType = WinType.REGULATION;
    if (this.isOvertime(gameNHLSchedule)) this.winType = WinType.OVERTIME;
    if (this.isShootout(gameNHLSchedule)) this.winType = WinType.SHOOTOUT;
  }

  private isComplete = (gameNHLSchedule: any): boolean => {
    return gameNHLSchedule.linescore.currentPeriodTimeRemaining === 'Final';
  }

  private isRegulation = (gameNHLSchedule: any): boolean => {
    return gameNHLSchedule.linescore.currentPeriodOrdinal === '3rd' && this.isComplete(gameNHLSchedule);
  }

  private isOvertime = (gameNHLSchedule: any): boolean => {
    return gameNHLSchedule.linescore.currentPeriodOrdinal === 'OT' && this.isComplete(gameNHLSchedule);
  }

  private isShootout = (gameNHLSchedule: any): boolean => {
    return gameNHLSchedule.linescore.currentPeriodOrdinal === 'SO' && this.isComplete(gameNHLSchedule);
  }

  private isHomeWin = (gameNHLSchedule: any): boolean => {
    return gameNHLSchedule.linescore.teams.home.goals > gameNHLSchedule.linescore.teams.away.goals;
  }

  private getWinner = (gameNHLSchedule: any): string => {
    if (this.isHomeWin(gameNHLSchedule))
      return gameNHLSchedule.linescore.teams.home.team.name;
    return gameNHLSchedule.linescore.teams.away.team.name;
    // return gameNHLSchedule.linescore.teams.home.team.id;
    // return gameNHLSchedule.linescore.teams.away.team.id;
  }

  private getLoser = (gameNHLSchedule: any): string => {
    if (this.isHomeWin(gameNHLSchedule))
      return gameNHLSchedule.linescore.teams.away.team.name;
    return gameNHLSchedule.linescore.teams.home.team.name;
    // return gameNHLSchedule.linescore.teams.away.team.id;
    // return gameNHLSchedule.linescore.teams.home.team.id;
  }
}

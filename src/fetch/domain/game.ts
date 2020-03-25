import { TeamInformation } from "./teamInformation";
import { WinType } from "./wintype";

class Game {
  readonly winnerId: string;
  readonly loserId: string;
  readonly winType: WinType;

  constructor(gameNHLSchedule: any) {
    this.winnerId = this.getWinner(gameNHLSchedule);
    this.loserId = this.getLoser(gameNHLSchedule);
    this.winType = WinType.UNDEFINED;
    if (this.isRegulation(gameNHLSchedule)) this.winType = WinType.REGULATION;
    if (this.isOvertime(gameNHLSchedule)) this.winType = WinType.OVERTIME;
    if (this.isShootout(gameNHLSchedule)) this.winType = WinType.SHOOTOUT;
  }

  isComplete = (gameNHLSchedule: any): boolean => {
    return gameNHLSchedule.linescore.currentPeriodTimeRemaining === 'Final';
  }

  isRegulation = (gameNHLSchedule: any): boolean => {
    return gameNHLSchedule.linescore.currentPeriodOrdinal === '3rd' && this.isComplete(gameNHLSchedule);
  }

  isOvertime = (gameNHLSchedule: any): boolean => {
    return gameNHLSchedule.linescore.currentPeriodOrdinal === 'OT' && this.isComplete(gameNHLSchedule);
  }

  isShootout = (gameNHLSchedule: any): boolean => {
    return gameNHLSchedule.linescore.currentPeriodOrdinal === 'SO' && this.isComplete(gameNHLSchedule);
  }

  isHomeWin = (gameNHLSchedule: any): boolean => {
    return gameNHLSchedule.linescore.teams.home.goals > gameNHLSchedule.linescore.teams.away.goals;
  }

  getWinner = (gameNHLSchedule: any): string => {
    if (this.isHomeWin(gameNHLSchedule))
      return gameNHLSchedule.linescore.teams.home.team.id;
    return gameNHLSchedule.linescore.teams.away.team.id;
  }

  getLoser = (gameNHLSchedule: any): string => {
    if (this.isHomeWin(gameNHLSchedule))
      return gameNHLSchedule.linescore.teams.away.team.id;
    return gameNHLSchedule.linescore.teams.home.team.id;
  }
}

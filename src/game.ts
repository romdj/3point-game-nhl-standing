import { TeamInformation } from "./teamInformation";
import { WinType } from "./wintype";

class Game {
  private readonly winner: TeamInformation;
  private readonly loser: TeamInformation;
  private readonly winType: WinType;

  constructor (winner: TeamInformation, loser: TeamInformation, winType: WinType) {
    this.winner = winner;
    this.loser = loser;
    this.winType = winType;
  }
}

import { NhlGameStatus } from "./NhlGameStatus";

export interface NhlGame {
    gamePk: number;
    link: string;
    gameType: string;
    season: string;
    gameDate: string;
    status: NhlGameStatus;
    teams: object;
    linescore: object;
    venue: object;
    content: { link: string };
};
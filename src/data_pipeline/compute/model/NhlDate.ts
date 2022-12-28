import { NhlGame } from "./NhlGame";

export interface NhlDate {
    date: string;
    totalItems: number;
    totalEvents: number;
    totalGames: number;
    totalMatches: number;
    games: NhlGame[];
    events: any /* NhlEvent[] */;
    matches: any /* NhlMatch[] */;
};

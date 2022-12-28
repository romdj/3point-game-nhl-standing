export interface NhlScheduleResponse {
    copyright: string;
    totalItems: number;
    totalEvents: number;
    totalGames: number;
    totalMatches: number;
    metaData: { timestamp: string; }
    wait: number;
    dates: any;
};
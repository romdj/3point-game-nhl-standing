/**
 * TypeScript interfaces for NHL API responses
 */

export interface NHLApiTeam {
  conferenceAbbrev: string;
  conferenceName: string;
  conferenceSequence: number;
  date: string;
  divisionName: string;
  divisionSequence: number;
  gamesPlayed: number;
  goalDifferential: number;
  goalAgainst: number;
  goalFor: number;
  homePoints: number;
  losses: number;
  otLosses: number;
  points: number;
  regulationWins: number;
  roadPoints: number;
  teamName: {
    default: string;
  };
  teamAbbrev: {
    default: string;
  };
  teamLogo: string;
  winPctg: number;
  wins: number;
}

export interface NHLApiStandingsResponse {
  standings: NHLApiTeam[];
}

export interface StandingsQueryArgs {
  date?: string;
}

export interface TransformedTeam {
  conferenceAbbrev: string;
  conferenceName: string;
  conferenceSequence: number;
  date: string;
  divisionName: string;
  divisionSequence: number;
  gamesPlayed: number;
  goalDifferential: number;
  goalAgainst: number;
  goalFor: number;
  homePoints: number;
  losses: number;
  otWins: number;
  otLosses: number;
  points: number;
  internationalSystemPoints: number;
  regulationWins: number;
  roadPoints: number;
  teamName: string;
  teamAbbrev: string;
  teamLogo: string;
  winPercentage: number;
  wins: number;
}
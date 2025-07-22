export interface PowerplayStats {
  powerplayGoals: number;
  powerplayMinutes: number;
  minutesPerPowerplayGoal: number | null;
  powerplayOpportunities: number;
  powerplayPercentage: number;
}

export interface Standing {
  gamesPlayed: number;
  otWins: number;
  internationalSystemPoints: number;
  teamName: string;
  teamAbbrev: string;
  teamLogo: string;
  points: number;
  wins: number;
  regulationWins: number;
  losses: number;
  otLosses: number;
  divisionName: string;
  conferenceName: string;
  goalFor: number;
  goalAgainst: number;
  goalDifferential: number;
  winPercentage: number;
  date: string;
  powerplayStats?: PowerplayStats;
}

export const CONFERENCES = {
  Eastern: ['Atlantic', 'Metropolitan'],
  Western: ['Pacific', 'Central']
}

export type TableColumn<T> = {
  key: keyof T;
  label: string;
};

export type StandingTableColumn = {
  key: keyof Standing | 'minutesPerPowerplayGoal' | 'powerplayPercentage';
  label: string;
  width: string;
  tooltip?: string;
};


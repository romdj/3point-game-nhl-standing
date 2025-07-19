export interface Standing {
  gamesPlayed: number;
  otWins: number;
  internationalSystemPoints: number;
  teamName: string;
  points: number;
  wins: number;
  regulationWins: number;
  losses: number;
  otLosses: number;
  divisionName: string;
  conferenceName: string;
}

export const CONFERENCES = {
  Eastern: ['Atlantic', 'Metropolitan'],
  Western: ['Pacific', 'Central']
}

export type TableColumn<T> = {
  key: keyof T;
  label: string;
};


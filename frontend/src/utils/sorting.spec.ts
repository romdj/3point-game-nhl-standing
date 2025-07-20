import { describe, it, expect } from 'vitest';
import { sortStandings, sortOrder } from './sorting';
import type { Standing } from '../domain/standing';

// Mock standings data for testing
const mockStandings: Standing[] = [
  {
    teamName: 'Team A',
    teamAbbrev: 'TMA',
    teamLogo: 'https://assets.nhle.com/logos/nhl/svg/TMA_light.svg',
    points: 50,
    internationalSystemPoints: 52,
    wins: 20,
    losses: 10,
    gamesPlayed: 30,
    regulationWins: 18,
    otWins: 2,
    otLosses: 5,
    conferenceName: 'Eastern',
    divisionName: 'Atlantic',
    goalFor: 120,
    goalAgainst: 110,
    goalDifferential: 10,
    winPercentage: 0.667,
    date: '2024-04-15'
  },
  {
    teamName: 'Team B',
    teamAbbrev: 'TMB',
    teamLogo: 'https://assets.nhle.com/logos/nhl/svg/TMB_light.svg',
    points: 45,
    internationalSystemPoints: 47,
    wins: 18,
    losses: 12,
    gamesPlayed: 30,
    regulationWins: 15,
    otWins: 3,
    otLosses: 2,
    conferenceName: 'Eastern',
    divisionName: 'Atlantic',
    goalFor: 105,
    goalAgainst: 115,
    goalDifferential: -10,
    winPercentage: 0.600,
    date: '2024-04-15'
  },
  {
    teamName: 'Team C',
    teamAbbrev: 'TMC',
    teamLogo: 'https://assets.nhle.com/logos/nhl/svg/TMC_light.svg',
    points: 55,
    internationalSystemPoints: 58,
    wins: 22,
    losses: 8,
    gamesPlayed: 30,
    regulationWins: 20,
    otWins: 2,
    otLosses: 1,
    conferenceName: 'Western',
    divisionName: 'Pacific',
    goalFor: 135,
    goalAgainst: 105,
    goalDifferential: 30,
    winPercentage: 0.733,
    date: '2024-04-15'
  }
];

describe('sorting utilities', () => {
  describe('sortStandings', () => {
    it('should sort standings by points in ascending order', () => {
      const result = sortStandings(mockStandings, 'points', 'asc');
      expect(result[0].points).toBe(45);
      expect(result[1].points).toBe(50);
      expect(result[2].points).toBe(55);
    });

    it('should sort standings by points in descending order', () => {
      const result = sortStandings(mockStandings, 'points', 'desc');
      expect(result[0].points).toBe(55);
      expect(result[1].points).toBe(50);
      expect(result[2].points).toBe(45);
    });

    it('should sort standings by team name alphabetically', () => {
      const result = sortStandings(mockStandings, 'teamName', 'asc');
      expect(result[0].teamName).toBe('Team A');
      expect(result[1].teamName).toBe('Team B');
      expect(result[2].teamName).toBe('Team C');
    });

    it('should sort standings by international system points', () => {
      const result = sortStandings(mockStandings, 'internationalSystemPoints', 'desc');
      expect(result[0].internationalSystemPoints).toBe(58);
      expect(result[1].internationalSystemPoints).toBe(52);
      expect(result[2].internationalSystemPoints).toBe(47);
    });

    it('should handle undefined values gracefully', () => {
      const standingsWithUndefined = [
        { ...mockStandings[0], points: undefined as any },
        mockStandings[1],
        mockStandings[2]
      ];

      const result = sortStandings(standingsWithUndefined, 'points', 'asc');
      expect(result).toHaveLength(3);
      // Should not throw an error
    });

    it('should handle empty array', () => {
      const result = sortStandings([], 'points', 'asc');
      expect(result).toEqual([]);
    });

    it('should handle single item array', () => {
      const result = sortStandings([mockStandings[0]], 'points', 'asc');
      expect(result).toEqual([mockStandings[0]]);
    });

    it('should handle identical values', () => {
      const identicalStandings = [
        { ...mockStandings[0], points: 50 },
        { ...mockStandings[1], points: 50 },
        { ...mockStandings[2], points: 50 }
      ];

      const result = sortStandings(identicalStandings, 'points', 'asc');
      expect(result).toHaveLength(3);
      expect(result[0].points).toBe(50);
      expect(result[1].points).toBe(50);
      expect(result[2].points).toBe(50);
    });

    it('should sort by wins', () => {
      const result = sortStandings(mockStandings, 'wins', 'desc');
      expect(result[0].wins).toBe(22);
      expect(result[1].wins).toBe(20);
      expect(result[2].wins).toBe(18);
    });
  });


  describe('sortOrder export', () => {
    it('should have default sort order of asc', () => {
      expect(sortOrder).toBe('asc');
    });
  });
});

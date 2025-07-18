import { describe, it, expect } from 'vitest';
import { organizeStandings } from './standingsOrganizer';
import type { Standing } from '../domain/standing';

// Mock NHL standings data with teams from different divisions
const mockStandings: Standing[] = [
  // Eastern Conference - Atlantic Division
  {
    teamName: 'Boston Bruins',
    points: 60,
    internationalSystemPoints: 65,
    divisionName: 'Atlantic',
    conferenceName: 'Eastern',
    wins: 25,
    losses: 10,
    gamesPlayed: 35,
    regulationWins: 22,
    otWins: 3,
    otLosses: 2,
  },
  {
    teamName: 'Toronto Maple Leafs',
    points: 55,
    internationalSystemPoints: 60,
    divisionName: 'Atlantic',
    conferenceName: 'Eastern',
    wins: 22,
    losses: 13,
    gamesPlayed: 35,
    regulationWins: 20,
    otWins: 2,
    otLosses: 3,
  },
  {
    teamName: 'Tampa Bay Lightning',
    points: 50,
    internationalSystemPoints: 55,
    divisionName: 'Atlantic',
    conferenceName: 'Eastern',
    wins: 20,
    losses: 15,
    gamesPlayed: 35,
    regulationWins: 18,
    otWins: 2,
    otLosses: 5,
  },
  {
    teamName: 'Florida Panthers',
    points: 45,
    internationalSystemPoints: 50,
    divisionName: 'Atlantic',
    conferenceName: 'Eastern',
    wins: 18,
    losses: 17,
    gamesPlayed: 35,
    regulationWins: 16,
    otWins: 2,
    otLosses: 7,
  },
  // Eastern Conference - Metropolitan Division
  {
    teamName: 'New York Rangers',
    points: 52,
    internationalSystemPoints: 57,
    divisionName: 'Metropolitan',
    conferenceName: 'Eastern',
    wins: 21,
    losses: 14,
    gamesPlayed: 35,
    regulationWins: 19,
    otWins: 2,
    otLosses: 4,
  },
  {
    teamName: 'New Jersey Devils',
    points: 48,
    internationalSystemPoints: 53,
    divisionName: 'Metropolitan',
    conferenceName: 'Eastern',
    wins: 19,
    losses: 16,
    gamesPlayed: 35,
    regulationWins: 17,
    otWins: 2,
    otLosses: 6,
  },
  // Western Conference - Central Division
  {
    teamName: 'Colorado Avalanche',
    points: 58,
    internationalSystemPoints: 63,
    divisionName: 'Central',
    conferenceName: 'Western',
    wins: 24,
    losses: 11,
    gamesPlayed: 35,
    regulationWins: 21,
    otWins: 3,
    otLosses: 1,
  },
  // Western Conference - Pacific Division
  {
    teamName: 'Vegas Golden Knights',
    points: 54,
    internationalSystemPoints: 59,
    divisionName: 'Pacific',
    conferenceName: 'Western',
    wins: 22,
    losses: 13,
    gamesPlayed: 35,
    regulationWins: 20,
    otWins: 2,
    otLosses: 3,
  }
];

describe('standingsOrganizer', () => {
  describe('organizeStandings', () => {
    describe('league view', () => {
      it('should return all teams under NHL key', () => {
        const result = organizeStandings(mockStandings, 'league');
        expect(result).toHaveProperty('NHL');
        expect(result.NHL).toHaveLength(mockStandings.length);
        expect(result.NHL).toEqual(mockStandings);
      });
    });

    describe('conference view', () => {
      it('should group teams by conference', () => {
        const result = organizeStandings(mockStandings, 'conference');
        expect(result).toHaveProperty('Eastern');
        expect(result).toHaveProperty('Western');

        // Check Eastern Conference teams
        expect(result.Eastern).toHaveLength(6);
        expect(result.Eastern.every(team => team.conferenceName === 'Eastern')).toBe(true);

        // Check Western Conference teams
        expect(result.Western).toHaveLength(2);
        expect(result.Western.every(team => team.conferenceName === 'Western')).toBe(true);
      });

      it('should sort teams within each conference by international system points', () => {
        const result = organizeStandings(mockStandings, 'conference');

        // Check Eastern Conference sorting
        const eastern = result.Eastern;
        for (let i = 0; i < eastern.length - 1; i++) {
          expect(eastern[i].internationalSystemPoints).toBeGreaterThanOrEqual(
            eastern[i + 1].internationalSystemPoints
          );
        }

        // Check Western Conference sorting
        const western = result.Western;
        for (let i = 0; i < western.length - 1; i++) {
          expect(western[i].internationalSystemPoints).toBeGreaterThanOrEqual(
            western[i + 1].internationalSystemPoints
          );
        }
      });
    });

    describe('division view', () => {
      it('should group teams by division', () => {
        const result = organizeStandings(mockStandings, 'division');
        expect(result).toHaveProperty('Atlantic');
        expect(result).toHaveProperty('Metropolitan');
        expect(result).toHaveProperty('Central');
        expect(result).toHaveProperty('Pacific');

        // Check Atlantic Division teams
        expect(result.Atlantic).toHaveLength(4);
        expect(result.Atlantic.every(team => team.divisionName === 'Atlantic')).toBe(true);

        // Check Metropolitan Division teams
        expect(result.Metropolitan).toHaveLength(2);
        expect(result.Metropolitan.every(team => team.divisionName === 'Metropolitan')).toBe(true);

        // Check Central Division teams
        expect(result.Central).toHaveLength(1);
        expect(result.Central.every(team => team.divisionName === 'Central')).toBe(true);

        // Check Pacific Division teams
        expect(result.Pacific).toHaveLength(1);
        expect(result.Pacific.every(team => team.divisionName === 'Pacific')).toBe(true);
      });

      it('should sort teams within each division by international system points', () => {
        const result = organizeStandings(mockStandings, 'division');

        // Check Atlantic Division sorting
        const atlantic = result.Atlantic;
        for (let i = 0; i < atlantic.length - 1; i++) {
          expect(atlantic[i].internationalSystemPoints).toBeGreaterThanOrEqual(
            atlantic[i + 1].internationalSystemPoints
          );
        }

        // Verify specific order for Atlantic
        expect(atlantic[0].teamName).toBe('Boston Bruins');
        expect(atlantic[1].teamName).toBe('Toronto Maple Leafs');
        expect(atlantic[2].teamName).toBe('Tampa Bay Lightning');
        expect(atlantic[3].teamName).toBe('Florida Panthers');
      });
    });

    describe('wildcard view', () => {
      it('should create division, wildcard, race, and rest groups for each conference', () => {
        const result = organizeStandings(mockStandings, 'wildcard');

        // Eastern Conference groups
        expect(result).toHaveProperty('Eastern - Atlantic');
        expect(result).toHaveProperty('Eastern - Metropolitan');
        expect(result).toHaveProperty('Eastern - Wild Card');
        expect(result).toHaveProperty('Eastern - Race');
        expect(result).toHaveProperty('Eastern - Rest');

        // Western Conference groups
        expect(result).toHaveProperty('Western - Central');
        expect(result).toHaveProperty('Western - Pacific');
        expect(result).toHaveProperty('Western - Wild Card');
        expect(result).toHaveProperty('Western - Race');
        expect(result).toHaveProperty('Western - Rest');
      });

      it('should place top 3 teams from each division in their division groups', () => {
        const result = organizeStandings(mockStandings, 'wildcard');

        // Atlantic Division should have top 3 teams
        expect(result['Eastern - Atlantic']).toHaveLength(3);
        expect(result['Eastern - Atlantic'][0].teamName).toBe('Boston Bruins');
        expect(result['Eastern - Atlantic'][1].teamName).toBe('Toronto Maple Leafs');
        expect(result['Eastern - Atlantic'][2].teamName).toBe('Tampa Bay Lightning');

        // Metropolitan Division should have top 2 teams (only 2 teams in mock data)
        expect(result['Eastern - Metropolitan']).toHaveLength(2);
        expect(result['Eastern - Metropolitan'][0].teamName).toBe('New York Rangers');
        expect(result['Eastern - Metropolitan'][1].teamName).toBe('New Jersey Devils');
      });

      it('should place remaining teams in wildcard, race, or rest based on points', () => {
        const result = organizeStandings(mockStandings, 'wildcard');

        // Eastern Conference should have 1 team remaining (Florida Panthers)
        // Should be in wild card since it's the best remaining team
        expect(result['Eastern - Wild Card']).toHaveLength(1);
        expect(result['Eastern - Wild Card'][0].teamName).toBe('Florida Panthers');

        // Western Conference has no remaining teams since we only have 1 team per division
        expect(result['Western - Wild Card']).toHaveLength(0);
        expect(result['Western - Race']).toHaveLength(0);
        expect(result['Western - Rest']).toHaveLength(0);
      });

      it('should handle empty divisions gracefully', () => {
        const limitedStandings = mockStandings.slice(0, 2); // Only 2 teams
        const result = organizeStandings(limitedStandings, 'wildcard');

        // Should still create all required groups
        expect(result).toHaveProperty('Eastern - Atlantic');
        expect(result).toHaveProperty('Eastern - Metropolitan');
        expect(result).toHaveProperty('Western - Central');
        expect(result).toHaveProperty('Western - Pacific');

        // Some groups should be empty
        expect(result['Eastern - Metropolitan']).toHaveLength(0);
        expect(result['Western - Central']).toHaveLength(0);
        expect(result['Western - Pacific']).toHaveLength(0);
      });
    });

    describe('edge cases', () => {
      it('should handle empty standings array', () => {
        const result = organizeStandings([], 'league');
        expect(result.NHL).toEqual([]);
      });

      it('should handle single team', () => {
        const singleTeam = [mockStandings[0]];
        const result = organizeStandings(singleTeam, 'conference');
        expect(result.Eastern).toHaveLength(1);
        expect(result.Western).toHaveLength(0);
      });

      it('should handle unknown division gracefully', () => {
        const unknownDivisionTeam = {
          ...mockStandings[0],
          divisionName: 'Unknown Division'
        };
        const result = organizeStandings([unknownDivisionTeam], 'conference');
        expect(result.Eastern).toHaveLength(0);
        expect(result.Western).toHaveLength(0);
      });

      it('should handle default case for invalid view type', () => {
        const result = organizeStandings(mockStandings, 'invalid' as any);
        expect(result).toHaveProperty('NHL');
        expect(result.NHL).toEqual(mockStandings);
      });
    });
  });
});

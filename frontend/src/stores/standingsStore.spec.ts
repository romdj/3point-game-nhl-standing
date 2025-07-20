import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { standingsStore } from './standingsStore';
import type { Standing } from '../domain/standing';

// Mock standings data
const mockStandings: Standing[] = [
  {
    teamName: 'Boston Bruins',
    teamAbbrev: 'BOS',
    teamLogo: 'https://assets.nhle.com/logos/nhl/svg/BOS_light.svg',
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
    goalFor: 140,
    goalAgainst: 105,
    goalDifferential: 35,
    winPercentage: 0.714,
    date: '2024-04-15'
  },
  {
    teamName: 'Toronto Maple Leafs',
    teamAbbrev: 'TOR',
    teamLogo: 'https://assets.nhle.com/logos/nhl/svg/TOR_light.svg',
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
    goalFor: 125,
    goalAgainst: 115,
    goalDifferential: 10,
    winPercentage: 0.629,
    date: '2024-04-15'
  }
];

describe('standingsStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    standingsStore.set([]);
  });

  it('should initialize with empty array', () => {
    const value = get(standingsStore);
    expect(value).toEqual([]);
  });

  it('should set standings data', () => {
    standingsStore.set(mockStandings);
    const value = get(standingsStore);
    expect(value).toEqual(mockStandings);
    expect(value).toHaveLength(2);
  });

  it('should update standings data', () => {
    // Set initial data
    standingsStore.set([mockStandings[0]]);
    expect(get(standingsStore)).toHaveLength(1);

    // Update with new data
    standingsStore.set(mockStandings);
    expect(get(standingsStore)).toHaveLength(2);
    expect(get(standingsStore)).toEqual(mockStandings);
  });

  it('should handle empty standings array', () => {
    standingsStore.set(mockStandings);
    expect(get(standingsStore)).toHaveLength(2);

    // Set to empty array
    standingsStore.set([]);
    expect(get(standingsStore)).toEqual([]);
  });

  it('should update specific fields when standings change', () => {
    standingsStore.set([mockStandings[0]]);

    const updatedStanding = {
      ...mockStandings[0],
      points: 65,
      internationalSystemPoints: 70,
      wins: 26
    };

    standingsStore.update(_standings => [updatedStanding]);

    const value = get(standingsStore);
    expect(value[0].points).toBe(65);
    expect(value[0].internationalSystemPoints).toBe(70);
    expect(value[0].wins).toBe(26);
  });

  it('should maintain reactivity when using update method', () => {
    standingsStore.set(mockStandings);

    // Add a new team using update
    const newTeam: Standing = {
      teamName: 'New York Rangers',
      teamAbbrev: 'NYR',
      teamLogo: 'https://assets.nhle.com/logos/nhl/svg/NYR_light.svg',
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
      goalFor: 120,
      goalAgainst: 110,
      goalDifferential: 10,
      winPercentage: 0.600,
      date: '2024-04-15'
    };

    standingsStore.update(standings => [...standings, newTeam]);

    const value = get(standingsStore);
    expect(value).toHaveLength(3);
    expect(value[2].teamName).toBe('New York Rangers');
  });

  it('should handle null or undefined values gracefully', () => {
    // This should not throw an error
    standingsStore.set([]);

    const value = get(standingsStore);
    expect(value).toEqual([]);
  });

  it('should preserve object references when not modified', () => {
    standingsStore.set(mockStandings);
    const value1 = get(standingsStore);

    // Get value again without modification
    const value2 = get(standingsStore);

    // Should be the same reference
    expect(value1).toBe(value2);
  });

  it('should create new reference when updated', () => {
    standingsStore.set(mockStandings);
    const value1 = get(standingsStore);

    // Update the store
    standingsStore.update(standings => [...standings]);
    const value2 = get(standingsStore);

    // Should be different references but same content
    expect(value1).not.toBe(value2);
    expect(value1).toEqual(value2);
  });

  it('should handle complex standing objects correctly', () => {
    const complexStanding: Standing = {
      teamName: 'Complex Team',
      teamAbbrev: 'CMP',
      teamLogo: 'https://assets.nhle.com/logos/nhl/svg/CMP_light.svg',
      points: 0,
      internationalSystemPoints: 0,
      divisionName: 'Atlantic',
      conferenceName: 'Eastern',
      wins: 0,
      losses: 0,
      gamesPlayed: 0,
      regulationWins: 0,
      otWins: 0,
      otLosses: 0,
      goalFor: 0,
      goalAgainst: 0,
      goalDifferential: 0,
      winPercentage: 0.000,
      date: '2024-04-15'
    };

    standingsStore.set([complexStanding]);
    const value = get(standingsStore);

    expect(value[0]).toEqual(complexStanding);
    expect(value[0].teamName).toBe('Complex Team');
    expect(value[0].points).toBe(0);
  });
});

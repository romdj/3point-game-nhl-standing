import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StandingsService } from './StandingsService';
import { StandingsSortingService } from './StandingsSortingService';
import { StandingsGroupingService } from './StandingsGroupingService';
import type { Standing } from '../../domain/standing';

// Mock the API module
vi.mock('../../api/standingsAPI', () => ({
  fetchStandings: vi.fn()
}));

// Mock the services
vi.mock('./StandingsSortingService');
vi.mock('./StandingsGroupingService');

describe('StandingsService', () => {
  let service: StandingsService;
  let mockSortingService: any;
  let mockGroupingService: any;
  let mockFetchStandings: any;

  const mockStandings: Standing[] = [
    {
      teamName: 'Boston Bruins',
      teamAbbrev: 'BOS',
      teamLogo: 'https://assets.nhle.com/logos/nhl/svg/BOS_light.svg',
      gamesPlayed: 82,
      wins: 50,
      losses: 20,
      otLosses: 12,
      otWins: 8,
      regulationWins: 42,
      points: 112,
      internationalSystemPoints: 150,
      divisionName: 'Atlantic',
      conferenceName: 'Eastern',
      goalFor: 280,
      goalAgainst: 210,
      goalDifferential: 70,
      winPercentage: 0.683,
      date: '2024-04-15'
    },
    {
      teamName: 'Toronto Maple Leafs',
      teamAbbrev: 'TOR',
      teamLogo: 'https://assets.nhle.com/logos/nhl/svg/TOR_light.svg',
      gamesPlayed: 82,
      wins: 45,
      losses: 25,
      otLosses: 12,
      otWins: 5,
      regulationWins: 40,
      points: 102,
      internationalSystemPoints: 140,
      divisionName: 'Atlantic',
      conferenceName: 'Eastern',
      goalFor: 250,
      goalAgainst: 225,
      goalDifferential: 25,
      winPercentage: 0.622,
      date: '2024-04-15'
    }
  ];

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Reset singleton
    (StandingsService as any).instance = undefined;
    
    // Mock the fetchStandings function
    const { fetchStandings } = await import('../../api/standingsAPI');
    mockFetchStandings = vi.mocked(fetchStandings);
    mockFetchStandings.mockResolvedValue(mockStandings);

    // Mock the service dependencies
    mockSortingService = {
      sortStandings: vi.fn().mockReturnValue(mockStandings)
    };
    mockGroupingService = {
      groupStandings: vi.fn().mockReturnValue({ 'NHL': mockStandings })
    };

    vi.mocked(StandingsSortingService).mockImplementation(() => mockSortingService);
    vi.mocked(StandingsGroupingService).mockImplementation(() => mockGroupingService);

    service = StandingsService.getInstance();
  });

  afterEach(() => {
    service.clearCache();
  });

  describe('getInstance', () => {
    it('should return the same instance (singleton)', () => {
      const instance1 = StandingsService.getInstance();
      const instance2 = StandingsService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('getStandings', () => {
    it('should fetch standings from API', async () => {
      const result = await service.getStandings();
      
      expect(mockFetchStandings).toHaveBeenCalledOnce();
      expect(result).toEqual(mockStandings);
    });

    it('should return cached standings on subsequent calls', async () => {
      await service.getStandings();
      const result = await service.getStandings();
      
      expect(mockFetchStandings).toHaveBeenCalledOnce();
      expect(result).toEqual(mockStandings);
    });

    it('should force refresh when requested', async () => {
      await service.getStandings();
      await service.getStandings(true);
      
      expect(mockFetchStandings).toHaveBeenCalledTimes(2);
    });

    it('should return stale cache on API error', async () => {
      // First successful call
      await service.getStandings();
      
      // Mock API failure
      mockFetchStandings.mockRejectedValueOnce(new Error('API Error'));
      
      const result = await service.getStandings(true);
      expect(result).toEqual(mockStandings);
    });

    it('should throw error when no cache available and API fails', async () => {
      mockFetchStandings.mockRejectedValueOnce(new Error('API Error'));
      
      await expect(service.getStandings()).rejects.toThrow('API Error');
    });
  });

  describe('getOrganizedStandings', () => {
    it('should organize standings using business services', async () => {
      const query = {
        viewType: 'conference' as const,
        sortKey: 'points' as const,
        sortOrder: 'desc' as const
      };

      const result = await service.getOrganizedStandings(query);

      expect(mockSortingService.sortStandings).toHaveBeenCalledWith(
        mockStandings,
        'points',
        'desc'
      );
      expect(mockGroupingService.groupStandings).toHaveBeenCalledWith(
        mockStandings,
        'conference',
        'points',
        'desc'
      );
      expect(result).toEqual({ 'NHL': mockStandings });
    });

    it('should use default sort parameters when not specified', async () => {
      const query = { viewType: 'league' as const };

      await service.getOrganizedStandings(query);

      expect(mockSortingService.sortStandings).toHaveBeenCalledWith(
        mockStandings,
        'internationalSystemPoints',
        'desc'
      );
    });
  });

  describe('getTeamStanding', () => {
    it('should return standing for existing team', async () => {
      const result = await service.getTeamStanding('Boston Bruins');
      expect(result).toEqual(mockStandings[0]);
    });

    it('should return null for non-existing team', async () => {
      const result = await service.getTeamStanding('Non-existent Team');
      expect(result).toBeNull();
    });
  });

  describe('getDivisionStandings', () => {
    it('should return sorted standings for division', async () => {
      const result = await service.getDivisionStandings('Atlantic');
      
      expect(mockSortingService.sortStandings).toHaveBeenCalledWith(
        mockStandings, // Both teams are in Atlantic
        'internationalSystemPoints',
        'desc'
      );
      expect(result).toEqual(mockStandings);
    });
  });

  describe('getConferenceStandings', () => {
    it('should return sorted standings for conference', async () => {
      const result = await service.getConferenceStandings('Eastern');
      
      expect(mockSortingService.sortStandings).toHaveBeenCalledWith(
        mockStandings, // Both teams are in Eastern
        'internationalSystemPoints',
        'desc'
      );
      expect(result).toEqual(mockStandings);
    });
  });

  describe('cache management', () => {
    it('should clear cache', () => {
      service.clearCache();
      const status = service.getCacheStatus();
      
      expect(status.isCached).toBe(false);
      expect(status.age).toBe(0);
      expect(status.isExpired).toBe(true);
    });

    it('should report cache status correctly', async () => {
      await service.getStandings();
      const status = service.getCacheStatus();
      
      expect(status.isCached).toBe(true);
      expect(status.age).toBeGreaterThanOrEqual(0);
      expect(status.isExpired).toBe(false);
    });
  });
});
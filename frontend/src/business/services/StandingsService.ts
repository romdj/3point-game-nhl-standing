import type { Standing } from '../../domain/standing';
import { fetchStandings } from '../../api/standingsAPI';
import { StandingsSortingService } from './StandingsSortingService';
import { StandingsGroupingService } from './StandingsGroupingService';
import { getAppConfig } from '../../config';
import { logger } from '../../utils/logger';

export type ViewType = 'conference' | 'division' | 'wildcard' | 'league';
export type SortKey = keyof Standing;
export type SortOrder = 'asc' | 'desc';

export interface GroupedStandings {
  [key: string]: Standing[];
}

export interface StandingsQuery {
  viewType: ViewType;
  sortKey?: SortKey;
  sortOrder?: SortOrder;
}

/**
 * Business service for managing NHL standings data
 * Handles fetching, sorting, grouping, and organizing standings
 */
export class StandingsService {
  private static instance: StandingsService;
  private cachedStandings: Standing[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes - avoid config dependency at init

  private constructor(
    private _sortingService = new StandingsSortingService(),
    private _groupingService = new StandingsGroupingService()
  ) {}

  public static getInstance(): StandingsService {
    if (!StandingsService.instance) {
      StandingsService.instance = new StandingsService();
    }
    return StandingsService.instance;
  }

  /**
   * Get standings data with caching
   */
  public async getStandings(forceRefresh = false): Promise<Standing[]> {
    const now = Date.now();
    const cacheExpired = now - this.cacheTimestamp > this.CACHE_TTL_MS;

    if (!forceRefresh && this.cachedStandings && !cacheExpired) {
      logger.debug('Returning cached standings data', 
        { cacheAge: now - this.cacheTimestamp }, 
        'StandingsService', 
        'getStandings'
      );
      return this.cachedStandings;
    }

    logger.info('Fetching fresh standings data', 
      { forceRefresh, cacheExpired }, 
      'StandingsService', 
      'getStandings'
    );

    try {
      const standings = await fetchStandings();
      this.cachedStandings = standings;
      this.cacheTimestamp = now;
      return standings;
    } catch (error) {
      logger.error('Failed to fetch standings', { error }, 'StandingsService', 'getStandings');
      // Return cached data if available, even if expired
      if (this.cachedStandings) {
        logger.warn('Returning stale cached data due to fetch error', {}, 'StandingsService', 'getStandings');
        return this.cachedStandings;
      }
      throw error;
    }
  }

  /**
   * Get organized standings based on view type and sorting preferences
   */
  public async getOrganizedStandings(query: StandingsQuery): Promise<GroupedStandings> {
    const config = getAppConfig();
    const { 
      viewType, 
      sortKey = config.nhl.standings.defaultSortKey, 
      sortOrder = config.nhl.standings.defaultSortOrder 
    } = query;
    
    logger.debug('Organizing standings', { viewType, sortKey, sortOrder }, 'StandingsService', 'getOrganizedStandings');

    const standings = await this.getStandings();
    
    // Apply sorting
    const sortedStandings = this._sortingService.sortStandings(standings, sortKey, sortOrder);
    
    // Apply grouping based on view type
    return this._groupingService.groupStandings(sortedStandings, viewType, sortKey, sortOrder);
  }

  /**
   * Get standings for a specific team
   */
  public async getTeamStanding(teamName: string): Promise<Standing | null> {
    const standings = await this.getStandings();
    return standings.find(team => team.teamName === teamName) || null;
  }

  /**
   * Get standings for a specific division
   */
  public async getDivisionStandings(divisionName: string): Promise<Standing[]> {
    const standings = await this.getStandings();
    const config = getAppConfig();
    return this._sortingService.sortStandings(
      standings.filter(team => team.divisionName === divisionName),
      config.nhl.standings.defaultSortKey,
      config.nhl.standings.defaultSortOrder
    );
  }

  /**
   * Get standings for a specific conference
   */
  public async getConferenceStandings(conferenceName: string): Promise<Standing[]> {
    const standings = await this.getStandings();
    const config = getAppConfig();
    return this._sortingService.sortStandings(
      standings.filter(team => team.conferenceName === conferenceName),
      config.nhl.standings.defaultSortKey,
      config.nhl.standings.defaultSortOrder
    );
  }

  /**
   * Clear the cache
   */
  public clearCache(): void {
    this.cachedStandings = null;
    this.cacheTimestamp = 0;
    logger.info('Standings cache cleared', {}, 'StandingsService', 'clearCache');
  }

  /**
   * Get cache status
   */
  public getCacheStatus(): { isCached: boolean; age: number; expired: boolean } {
    const now = Date.now();
    const age = this.cacheTimestamp === 0 ? 0 : now - this.cacheTimestamp;
    const expired = this.cacheTimestamp === 0 || age > this.CACHE_TTL_MS;
    
    return {
      isCached: this.cachedStandings !== null,
      age,
      expired
    };
  }
}
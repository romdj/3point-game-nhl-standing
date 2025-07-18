import { StandingsService, type StandingsQuery, type GroupedStandings } from '../services/StandingsService';
import { logger } from '../../utils/logger';

/**
 * Use case for retrieving organized standings data
 * Encapsulates the business logic for fetching and organizing NHL standings
 */
export class GetOrganizedStandingsUseCase {
  
  constructor(private _standingsService = StandingsService.getInstance()) {}

  /**
   * Execute the use case to get organized standings
   */
  public async execute(query: StandingsQuery): Promise<GroupedStandings> {
    const startTime = performance.now();
    
    try {
      logger.info('Executing GetOrganizedStandings use case', 
        { query }, 
        'GetOrganizedStandingsUseCase', 
        'execute'
      );

      const result = await this._standingsService.getOrganizedStandings(query);
      
      const executionTime = performance.now() - startTime;
      logger.info('GetOrganizedStandings use case completed successfully', 
        { 
          query, 
          executionTime: `${executionTime.toFixed(2)}ms`,
          groupCount: Object.keys(result).length,
          totalTeams: Object.values(result).reduce((sum, teams) => sum + teams.length, 0)
        }, 
        'GetOrganizedStandingsUseCase', 
        'execute'
      );

      return result;
    } catch (error) {
      const executionTime = performance.now() - startTime;
      logger.error('GetOrganizedStandings use case failed', 
        { 
          query, 
          executionTime: `${executionTime.toFixed(2)}ms`,
          error: error instanceof Error ? error.message : String(error)
        }, 
        'GetOrganizedStandingsUseCase', 
        'execute'
      );
      throw error;
    }
  }

  /**
   * Execute with validation
   */
  public async executeWithValidation(query: StandingsQuery): Promise<GroupedStandings> {
    this.validateQuery(query);
    return this.execute(query);
  }

  /**
   * Validate the query parameters
   */
  private validateQuery(query: StandingsQuery): void {
    const validViewTypes = ['conference', 'division', 'wildcard', 'league'];
    const validSortOrders = ['asc', 'desc'];

    if (!validViewTypes.includes(query.viewType)) {
      throw new Error(`Invalid view type: ${query.viewType}. Must be one of: ${validViewTypes.join(', ')}`);
    }

    if (query.sortOrder && !validSortOrders.includes(query.sortOrder)) {
      throw new Error(`Invalid sort order: ${query.sortOrder}. Must be one of: ${validSortOrders.join(', ')}`);
    }

    if (query.sortKey && typeof query.sortKey !== 'string') {
      throw new Error('Sort key must be a string');
    }
  }
}
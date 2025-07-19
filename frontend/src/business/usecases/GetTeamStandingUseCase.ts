import { StandingsService } from '../services/StandingsService';
import type { Standing } from '../../domain/standing';
import { logger } from '../../utils/logger';

/**
 * Use case for retrieving a specific team's standing
 */
export class GetTeamStandingUseCase {
  
  constructor(private _standingsService = StandingsService.getInstance()) {}

  /**
   * Execute the use case to get a team's standing
   */
  public async execute(teamName: string): Promise<Standing | null> {
    const startTime = performance.now();
    
    try {
      if (!teamName || typeof teamName !== 'string') {
        throw new Error('Team name is required and must be a string');
      }

      logger.info('Executing GetTeamStanding use case', 
        { teamName }, 
        'GetTeamStandingUseCase', 
        'execute'
      );

      const result = await this._standingsService.getTeamStanding(teamName);
      
      const executionTime = performance.now() - startTime;
      logger.info('GetTeamStanding use case completed', 
        { 
          teamName, 
          found: result !== null,
          executionTime: `${executionTime.toFixed(2)}ms`
        }, 
        'GetTeamStandingUseCase', 
        'execute'
      );

      return result;
    } catch (error) {
      const executionTime = performance.now() - startTime;
      logger.error('GetTeamStanding use case failed', 
        { 
          teamName, 
          executionTime: `${executionTime.toFixed(2)}ms`,
          error: error instanceof Error ? error.message : String(error)
        }, 
        'GetTeamStandingUseCase', 
        'execute'
      );
      throw error;
    }
  }

  /**
   * Check if a team exists in the standings
   */
  public async teamExists(teamName: string): Promise<boolean> {
    try {
      const standing = await this.execute(teamName);
      return standing !== null;
    } catch {
      return false;
    }
  }
}
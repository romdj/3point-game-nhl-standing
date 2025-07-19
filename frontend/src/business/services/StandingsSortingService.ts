import type { Standing } from '../../domain/standing';

export type SortKey = keyof Standing;
export type SortOrder = 'asc' | 'desc';

/**
 * Service responsible for sorting standings data
 */
export class StandingsSortingService {
  
  /**
   * Sort standings by a given key and order
   */
  public sortStandings(standings: Standing[], sortKey: SortKey, sortOrder: SortOrder = 'desc'): Standing[] {
    return [...standings].sort((a, b) => this.compareStandings(a, b, sortKey, sortOrder));
  }

  /**
   * Compare two standings based on sort key and order
   */
  private compareStandings(a: Standing, b: Standing, sortKey: SortKey, sortOrder: SortOrder): number {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    
    // Handle numeric values
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    }
    
    // Handle string values
    const aStr = String(aVal);
    const bStr = String(bVal);
    
    const comparison = aStr.localeCompare(bStr);
    return sortOrder === 'desc' ? -comparison : comparison;
  }

  /**
   * Sort standings using NHL playoff tiebreaking rules
   * Priority: Points -> Regulation/OT Wins -> Games Played (fewer is better) -> Head to Head (not implemented)
   */
  public sortStandingsWithTiebreaker(standings: Standing[]): Standing[] {
    return [...standings].sort((a, b) => {
      // Primary: International system points (3-2-1-0)
      if (a.internationalSystemPoints !== b.internationalSystemPoints) {
        return b.internationalSystemPoints - a.internationalSystemPoints;
      }
      
      // Tiebreaker 1: More regulation + overtime wins
      const aRegOTWins = a.regulationWins + a.otWins;
      const bRegOTWins = b.regulationWins + b.otWins;
      if (aRegOTWins !== bRegOTWins) {
        return bRegOTWins - aRegOTWins;
      }
      
      // Tiebreaker 2: Fewer games played (better point percentage)
      if (a.gamesPlayed !== b.gamesPlayed) {
        return a.gamesPlayed - b.gamesPlayed;
      }
      
      // Tiebreaker 3: Head-to-head record (not implemented - would need additional data)
      // For now, fall back to alphabetical team name
      return a.teamName.localeCompare(b.teamName);
    });
  }

  /**
   * Get available sort keys with their display names
   */
  public getSortKeys(): Array<{ key: SortKey; label: string; type: 'number' | 'string' }> {
    return [
      { key: 'internationalSystemPoints', label: 'International Points', type: 'number' },
      { key: 'points', label: 'NHL Points', type: 'number' },
      { key: 'wins', label: 'Wins', type: 'number' },
      { key: 'regulationWins', label: 'Regulation Wins', type: 'number' },
      { key: 'otWins', label: 'Overtime Wins', type: 'number' },
      { key: 'losses', label: 'Losses', type: 'number' },
      { key: 'otLosses', label: 'Overtime Losses', type: 'number' },
      { key: 'gamesPlayed', label: 'Games Played', type: 'number' },
      { key: 'teamName', label: 'Team Name', type: 'string' },
      { key: 'divisionName', label: 'Division', type: 'string' },
      { key: 'conferenceName', label: 'Conference', type: 'string' }
    ];
  }
}
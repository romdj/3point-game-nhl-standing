import type { Standing } from '../../domain/standing';
import { CONFERENCES } from '../../domain/standing';
import { getAppConfig } from '../../config';
import { StandingsSortingService, type SortKey, type SortOrder } from './StandingsSortingService';

export type ViewType = 'conference' | 'division' | 'wildcard' | 'league';

export interface GroupedStandings {
  [key: string]: Standing[];
}

/**
 * Service responsible for grouping and organizing standings data
 */
export class StandingsGroupingService {
  
  constructor(private _sortingService = new StandingsSortingService()) {}

  /**
   * Group standings based on view type
   */
  public groupStandings(
    standings: Standing[], 
    viewType: ViewType,
    sortKey: SortKey = 'internationalSystemPoints',
    sortOrder: SortOrder = 'desc'
  ): GroupedStandings {
    switch (viewType) {
      case 'conference':
        return this.groupByConference(standings, sortKey, sortOrder);
      case 'division':
        return this.groupByDivision(standings, sortKey, sortOrder);
      case 'wildcard':
        return this.organizeWildCard(standings, sortKey, sortOrder);
      case 'league':
      default:
        return { 'NHL': standings };
    }
  }

  /**
   * Group standings by conference
   */
  private groupByConference(standings: Standing[], sortKey: SortKey, sortOrder: SortOrder): GroupedStandings {
    const grouped: GroupedStandings = {
      Eastern: [],
      Western: []
    };

    standings.forEach(team => {
      const conference = this.getTeamConference(team.divisionName);
      if (conference) {
        grouped[conference].push(team);
      }
    });

    // Sort each conference
    Object.keys(grouped).forEach(conference => {
      grouped[conference] = this._sortingService.sortStandings(grouped[conference], sortKey, sortOrder);
    });

    return grouped;
  }

  /**
   * Group standings by division
   */
  private groupByDivision(standings: Standing[], sortKey: SortKey, sortOrder: SortOrder): GroupedStandings {
    const grouped: GroupedStandings = {};

    standings.forEach(team => {
      if (!grouped[team.divisionName]) {
        grouped[team.divisionName] = [];
      }
      grouped[team.divisionName].push(team);
    });

    // Sort each division
    Object.keys(grouped).forEach(division => {
      grouped[division] = this._sortingService.sortStandings(grouped[division], sortKey, sortOrder);
    });

    return grouped;
  }

  /**
   * Organize standings in wildcard format with playoff picture
   */
  private organizeWildCard(standings: Standing[], sortKey: SortKey, sortOrder: SortOrder): GroupedStandings {
    const grouped: GroupedStandings = {};
    
    // First, group by division with sorting
    const byDivision = this.groupByDivision(standings, sortKey, sortOrder);
    
    // Process each conference separately
    Object.entries(CONFERENCES).forEach(([conference, divisions]) => {
      this.organizeConferenceWildcard(conference, divisions, byDivision, grouped, sortKey, sortOrder);
    });
    
    return grouped;
  }

  /**
   * Organize wildcard for a specific conference
   */
  private organizeConferenceWildcard(
    conference: string,
    divisions: readonly string[],
    byDivision: GroupedStandings,
    grouped: GroupedStandings,
    sortKey: SortKey,
    sortOrder: SortOrder
  ): void {
    // Create sections for each division, wildcard, race, and rest
    divisions.forEach(division => {
      grouped[`${conference} - ${division}`] = [];
    });
    grouped[`${conference} - Wild Card`] = [];
    grouped[`${conference} - Race`] = [];
    grouped[`${conference} - Rest`] = [];
    
    // Get all teams in this conference by division
    const remainingTeams: Standing[] = [];
    
    // Extract top 3 from each division (already sorted by groupByDivision)
    divisions.forEach(division => {
      const divisionTeams = [...(byDivision[division] || [])];
      
      // Get top teams (already sorted)
      const config = getAppConfig();
      const topThree = divisionTeams.slice(0, config.nhl.wildcard.divisionAutomaticQualifiers);
      const rest = divisionTeams.slice(config.nhl.wildcard.divisionAutomaticQualifiers);
      
      // Add top 3 to their division group
      grouped[`${conference} - ${division}`] = topThree;
      
      // Add remaining teams to conference pool for wild card consideration
      remainingTeams.push(...rest);
    });
    
    // Sort remaining conference teams
    const sortedRemainingTeams = this._sortingService.sortStandings(remainingTeams, sortKey, sortOrder);
    
    // Take top 2 for wild card
    const config = getAppConfig();
    const wildCardTeams = sortedRemainingTeams.slice(0, config.nhl.wildcard.wildcardSpotsPerConference);
    
    // Find the cutoff point for the playoff race
    const wildCardCutoff = wildCardTeams.length > 0 
      ? wildCardTeams[wildCardTeams.length - 1].internationalSystemPoints - config.nhl.wildcard.playoffRacePointThreshold
      : 0;
    
    // Separate teams in the race from the rest
    const raceTeams = [];
    const restOfConference = [];
    
    for (let i = config.nhl.wildcard.wildcardSpotsPerConference; i < sortedRemainingTeams.length; i++) {
      const team = sortedRemainingTeams[i];
      if (team.internationalSystemPoints >= wildCardCutoff) {
        raceTeams.push(team);
      } else {
        restOfConference.push(team);
      }
    }
    
    // Assign to groups
    grouped[`${conference} - Wild Card`] = wildCardTeams;
    grouped[`${conference} - Race`] = raceTeams;
    grouped[`${conference} - Rest`] = restOfConference;
  }

  /**
   * Get the conference for a given division
   */
  private getTeamConference(divisionName: string): string | null {
    const conference = Object.entries(CONFERENCES).find(([_conf, divisions]) => 
      divisions.includes(divisionName)
    );
    return conference ? conference[0] : null;
  }

  /**
   * Get playoff status for a team based on its position
   */
  public getPlayoffStatus(groupName: string, index: number): 'division-leader' | 'wildcard' | 'race' | 'non-playoff' {
    if (groupName.includes('Wild Card')) {
      return 'wildcard';
    } else if (!groupName.includes('Race') && !groupName.includes('Rest') && index < getAppConfig().nhl.wildcard.divisionAutomaticQualifiers) {
      return 'division-leader';
    } else if (groupName.includes('Race')) {
      return 'race';
    }
    return 'non-playoff';
  }

  /**
   * Get section metadata for display
   */
  public getSectionInfo(groupName: string): { title: string; description: string; icon: string } {
    const config = getAppConfig();
    
    if (groupName.includes('Wild Card')) {
      return {
        title: 'Wild Card',
        description: 'Current playoff qualifiers via wild card spots',
        icon: '🌟'
      };
    } else if (groupName.includes('Race')) {
      return {
        title: 'Playoff Race',
        description: `Teams within ${config.nhl.wildcard.playoffRacePointThreshold} points of the final wild card spot`,
        icon: '🏁'
      };
    } else if (groupName.includes('Rest')) {
      return {
        title: 'Rest of Conference',
        description: `Teams more than ${config.nhl.wildcard.playoffRacePointThreshold} points out of a playoff spot`,
        icon: '📊'
      };
    } else {
      // Division
      const divisionName = groupName.split(' - ')[1] || groupName;
      return {
        title: divisionName,
        description: `Top ${config.nhl.wildcard.divisionAutomaticQualifiers} teams qualify for playoffs`,
        icon: '🏆'
      };
    }
  }
}
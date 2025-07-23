/**
 * Service for fetching NHL team powerplay statistics
 */

import got from 'got';
import type { PowerplayStats, NHLApiTeamPowerplayResponse } from '../types/nhl-api.types.js';
import { logger } from '../utils/logger.js';
import { API_TIMEOUTS, RETRY_LIMITS } from '../constants/shared.js';

export class PowerplayService {
  private static instance: PowerplayService;

  private constructor() {}

  public static getInstance(): PowerplayService {
    if (!PowerplayService.instance) {
      PowerplayService.instance = new PowerplayService();
    }
    return PowerplayService.instance;
  }

  /**
   * Fetches powerplay statistics for a specific team using team abbreviation
   */
  async getPowerplayStats(teamAbbrev: string, season: string = '20242025'): Promise<PowerplayStats | null> {
    const url = `https://api.nhle.com/stats/rest/en/team/powerplay?cayenneExp=seasonId=${season}`;
    
    logger.debug({ teamAbbrev, season, url }, 'Fetching powerplay stats for all teams');

    try {
      const response = await got.get(url, {
        responseType: 'json',
        timeout: {
          request: API_TIMEOUTS.DEFAULT_REQUEST
        },
        retry: {
          limit: RETRY_LIMITS.API_REQUESTS,
          methods: ['GET']
        }
      }).json<{ data: NHLApiTeamPowerplayResponse[] }>();

      if (!response.data || response.data.length === 0) {
        logger.warn({ teamAbbrev, season }, 'No powerplay data found');
        return null;
      }

      // Find the team data by matching team name to abbreviation
      const teamData = this.findTeamByAbbrev(response.data, teamAbbrev);
      
      if (!teamData) {
        logger.warn({ teamAbbrev, season }, 'Team not found in powerplay data');
        return null;
      }

      const powerplayStats = this.transformPowerplayData(teamData);
      
      logger.debug({ 
        teamAbbrev, 
        season, 
        teamFullName: teamData.teamFullName,
        powerplayStats 
      }, 'Successfully fetched and transformed powerplay stats');

      return powerplayStats;

    } catch (error) {
      logger.error({ 
        teamAbbrev, 
        season, 
        url,
        error: error instanceof Error ? error.message : String(error) 
      }, 'Failed to fetch powerplay stats');
      
      return null;
    }
  }

  /**
   * Find team data by matching abbreviation to team name
   * Uses a more robust matching strategy to handle name variations
   */
  private findTeamByAbbrev(teams: NHLApiTeamPowerplayResponse[], abbrev: string): NHLApiTeamPowerplayResponse | null {
    // Normalize team name for matching (remove accents, spaces, etc.)
    const normalizeTeamName = (name: string): string => {
      return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]/g, ''); // Remove spaces and special chars
    };

    // Team abbreviation to normalized name patterns
    const teamNameMap: Record<string, string[]> = {
      'MTL': ['montreal canadiens', 'montréal canadiens'],
      'TOR': ['toronto maple leafs'], 
      'BOS': ['boston bruins'],
      'TBL': ['tampa bay lightning'],
      'FLA': ['florida panthers'],
      'DET': ['detroit red wings'],
      'BUF': ['buffalo sabres'],
      'OTT': ['ottawa senators'],
      'NYR': ['new york rangers'],
      'NYI': ['new york islanders'], 
      'NJD': ['new jersey devils'],
      'PHI': ['philadelphia flyers'],
      'PIT': ['pittsburgh penguins'],
      'WSH': ['washington capitals'],
      'CAR': ['carolina hurricanes'],
      'CBJ': ['columbus blue jackets'],
      'CHI': ['chicago blackhawks'],
      'STL': ['st louis blues', 'st. louis blues'],
      'MIN': ['minnesota wild'],
      'NSH': ['nashville predators'],
      'DAL': ['dallas stars'],
      'COL': ['colorado avalanche'],
      'WPG': ['winnipeg jets'],
      'CGY': ['calgary flames'],
      'EDM': ['edmonton oilers'],
      'VAN': ['vancouver canucks'],
      'SEA': ['seattle kraken'],
      'LAK': ['los angeles kings'],
      'ANA': ['anaheim ducks'],
      'SJS': ['san jose sharks'],
      'VGK': ['vegas golden knights'],
      'UTA': ['utah hockey club']
    };

    const expectedNames = teamNameMap[abbrev.toUpperCase()];
    if (!expectedNames) {
      logger.warn({ abbrev }, 'Unknown team abbreviation');
      return null;
    }

    // Find team by matching normalized names
    const normalizedExpectedNames = expectedNames.map(normalizeTeamName);
    
    const matchedTeam = teams.find(team => {
      const normalizedTeamName = normalizeTeamName(team.teamFullName);
      return normalizedExpectedNames.includes(normalizedTeamName);
    });

    if (!matchedTeam) {
      // Log available team names for debugging
      const availableTeams = teams.map(t => t.teamFullName).slice(0, 5);
      logger.warn({ 
        abbrev, 
        expectedNames, 
        normalizedExpectedNames,
        sampleAvailableTeams: availableTeams 
      }, 'Team not found in powerplay data');
    }

    return matchedTeam || null;
  }

  /**
   * Transforms NHL API team powerplay response to our PowerplayStats interface
   */
  private transformPowerplayData(data: NHLApiTeamPowerplayResponse): PowerplayStats {
    const powerplayGoals = data.powerPlayGoalsFor || 0;
    const ppTimeOnIcePerGameSeconds = data.ppTimeOnIcePerGame || 0;
    const gamesPlayed = data.gamesPlayed || 0;
    const powerplayOpportunities = data.ppOpportunities || 0;

    // Calculate total powerplay time in minutes
    const totalPowerplayTimeSeconds = ppTimeOnIcePerGameSeconds * gamesPlayed;
    const totalPowerplayMinutes = totalPowerplayTimeSeconds / 60;

    const minutesPerPowerplayGoal = powerplayGoals > 0 
      ? totalPowerplayMinutes / powerplayGoals 
      : null;

    // powerPlayPct is already as decimal (e.g. 0.20883), convert to percentage
    const powerplayPercentage = (data.powerPlayPct || 0) * 100;

    return {
      powerplayGoals,
      powerplayMinutes: totalPowerplayMinutes,
      minutesPerPowerplayGoal,
      powerplayOpportunities,
      powerplayPercentage
    };
  }

  /**
   * Calculates minutes per powerplay goal
   */
  static calculateMinutesPerPowerplayGoal(goals: number, minutes: number): number | null {
    return goals > 0 ? minutes / goals : null;
  }
}

export const powerplayService = PowerplayService.getInstance();
import got from 'got';
import type { NHLApiStandingsResponse, NHLApiTeam, StandingsQueryArgs, TransformedTeam } from '../../types/nhl-api.types.js';
import { API_ENDPOINTS, POINT_SYSTEMS, ERROR_MESSAGES } from '../../constants/index.js';
import { logger, PerformanceLogger } from '../../utils/logger.js';
import { API_TIMEOUTS, RETRY_LIMITS } from '../../constants/shared.js';
import { powerplayService } from '../../services/powerplayService.js';

export const teamsStandings = {
  Query: {
    standings: async (_: unknown, { date }: StandingsQueryArgs): Promise<TransformedTeam[]> => {
      const requestDate = date || new Date().toISOString().split('T')[0];
      const url = `${API_ENDPOINTS.NHL_STANDINGS}/${requestDate}`;
      
      logger.info({ date: requestDate, url }, 'Fetching NHL standings');
      
      return await PerformanceLogger.measureAsync('nhl-api-request', async () => {
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
          }).json<NHLApiStandingsResponse>();
          const teams = response.standings;
          
          logger.info({ 
            date: requestDate, 
            teamCount: teams.length 
          }, 'Successfully fetched NHL standings');

          // Return the transformed team data to match the GraphQL schema
          const transformedTeams = teams.map((team: NHLApiTeam): TransformedTeam => ({
            conferenceAbbrev: team.conferenceAbbrev,
            conferenceName: team.conferenceName,
            conferenceSequence: team.conferenceSequence,
            date: team.date,
            divisionName: team.divisionName,
            divisionSequence: team.divisionSequence,
            gamesPlayed: team.gamesPlayed,
            goalDifferential: team.goalDifferential,
            goalAgainst: team.goalAgainst,
            goalFor: team.goalFor,
            homePoints: team.homePoints,
            losses: team.losses,
            otWins: team.wins - team.regulationWins,
            otLosses: team.otLosses,
            points: team.points,
            internationalSystemPoints: 
              team.otLosses * POINT_SYSTEMS.INTERNATIONAL.OT_LOSS + 
              (team.wins - team.regulationWins) * POINT_SYSTEMS.INTERNATIONAL.OT_WIN + 
              team.regulationWins * POINT_SYSTEMS.INTERNATIONAL.REGULATION_WIN,
            regulationWins: team.regulationWins,
            roadPoints: team.roadPoints,
            teamName: team.teamName.default,  // English team name
            teamAbbrev: team.teamAbbrev.default,
            teamLogo: team.teamLogo,
            winPercentage: team.winPctg,
            wins: team.wins
          }));
          
          logger.debug({ 
            date: requestDate, 
            transformedCount: transformedTeams.length 
          }, 'Successfully transformed team data');
          
          return transformedTeams;
        } catch (error) {
          logger.error({ 
            date: requestDate, 
            url, 
            error: error instanceof Error ? error.message : String(error) 
          }, ERROR_MESSAGES.FETCH_STANDINGS_FAILED);
          throw new Error(ERROR_MESSAGES.FETCH_STANDINGS_FAILED);
        }
      }, { date: requestDate });
    }
  },
  
  Team: {
    powerplayStats: async (parent: TransformedTeam) => {
      logger.debug({ 
        teamAbbrev: parent.teamAbbrev,
        teamName: parent.teamName 
      }, 'Fetching powerplay stats for team');
      
      try {
        const powerplayStats = await powerplayService.getPowerplayStats(parent.teamAbbrev);
        
        logger.debug({ 
          teamAbbrev: parent.teamAbbrev,
          powerplayStats 
        }, 'Successfully fetched powerplay stats');
        
        return powerplayStats;
      } catch (error) {
        logger.error({ 
          teamAbbrev: parent.teamAbbrev,
          error: error instanceof Error ? error.message : String(error) 
        }, 'Failed to fetch powerplay stats for team');
        
        return null;
      }
    }
  }
};

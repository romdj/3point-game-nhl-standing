import axios from 'axios';
import type { NHLApiStandingsResponse, NHLApiTeam, StandingsQueryArgs, TransformedTeam } from '../../types/nhl-api.types.js';
import { API_ENDPOINTS, POINT_SYSTEMS, ERROR_MESSAGES } from '../../constants/index.js';

export const teamsStandings = {
  Query: {
    standings: async (_: unknown, { date }: StandingsQueryArgs): Promise<TransformedTeam[]> => {
      try {
        date = date || new Date().toISOString().split('T')[0];
        const url = `${API_ENDPOINTS.NHL_STANDINGS}/${date}`;
        const response = await axios.get<NHLApiStandingsResponse>(url);
        const teams = response.data.standings;

        // Return the transformed team data to match the GraphQL schema
        return teams.map((team: NHLApiTeam): TransformedTeam => ({
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
      } catch (error) {
        console.error(ERROR_MESSAGES.FETCH_STANDINGS_FAILED, error);
        throw new Error(ERROR_MESSAGES.FETCH_STANDINGS_FAILED);
      }
    }
  }
};

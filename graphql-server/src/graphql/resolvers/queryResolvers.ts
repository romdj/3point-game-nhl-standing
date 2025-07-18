import axios from 'axios';
import type { NHLApiStandingsResponse, NHLApiTeam, StandingsQueryArgs, TransformedTeam } from '../../types/nhl-api.types.js';

export const teamsStandings = {
  Query: {
    standings: async (_: unknown, { date }: StandingsQueryArgs): Promise<TransformedTeam[]> => {
      try {
        date = date || new Date().toISOString().split('T')[0];
        const url = `https://api-web.nhle.com/v1/standings/${date}`;
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
          internationalSystemPoints: team.otLosses * 1 + (team.wins - team.regulationWins) * 2 + team.regulationWins * 3,
          regulationWins: team.regulationWins,
          roadPoints: team.roadPoints,
          teamName: team.teamName.default,  // English team name
          teamAbbrev: team.teamAbbrev.default,
          teamLogo: team.teamLogo,
          winPercentage: team.winPctg,
          wins: team.wins
        }));
      } catch (error) {
        console.error('Failed to fetch standings data:', error);
        throw new Error('Failed to fetch standings data');
      }
    }
  }
};

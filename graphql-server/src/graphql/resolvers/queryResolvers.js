"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamsStandings = void 0;
const axios_1 = __importDefault(require("axios"));
exports.teamsStandings = {
    Query: {
        standings: async (_, { date }) => {
            try {
                date = date || new Date().toISOString().split('T')[0];
                // const date = new Date().toISOString().split('T')[0];
                console.log(`Fetching standings data for ${date}`);
                const url = `https://api-web.nhle.com/v1/standings/${date}`;
                console.log(`Fetching standings data for ${date} from ${url}`);
                const response = await axios_1.default.get(url);
                console.log(`Fetched standings data for ${date}, response status: ${response.status} for ${response.data.standings.length} teams`);
                const teams = response.data.standings;
                console.log(`Transforming standings data for ${date}`);
                // Return the transformed team data to match the GraphQL schema
                return teams.map((team) => ({
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
                    teamName: team.teamName.default, // English team name
                    teamAbbrev: team.teamAbbrev.default,
                    teamLogo: team.teamLogo,
                    winPercentage: team.winPctg,
                    wins: team.wins
                }));
            }
            catch (error) {
                console.error('Failed to fetch standings data:');
                console.error(error);
                throw new Error('Failed to fetch standings data');
            }
        }
    }
};

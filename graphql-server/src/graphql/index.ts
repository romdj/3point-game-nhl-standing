import { teamsStandings } from './resolvers/queryResolvers';
import { typeDefs } from './schemas/querySchema';

export const resolvers = {
  Query: teamsStandings.Query,
  Team: teamsStandings.Team,
};  // Ensure that Query and Team resolvers are exported

export const schema = typeDefs;

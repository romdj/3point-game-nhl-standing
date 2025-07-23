import { teamsStandings } from './resolvers/queryResolvers.js';
import { typeDefs } from './schemas/querySchema.js';

export const resolvers = {
  Query: teamsStandings.Query,
  Team: teamsStandings.Team,
};  // Ensure that Query and Team resolvers are exported

export const schema = typeDefs;

import { teamsStandings } from './resolvers/queryResolvers';
import { typeDefs } from './schemas/querySchema';

export const resolvers = {
  Query: teamsStandings.Query,
};  // Ensure that Query is exported in the expected format

export const schema = typeDefs;

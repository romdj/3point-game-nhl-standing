import { createClient, cacheExchange, fetchExchange} from '@urql/svelte';
import config from '../config/env.js';

export const client = createClient({
  url: config.GRAPHQL_URL,
  exchanges: [cacheExchange, fetchExchange],
});

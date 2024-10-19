import { createClient } from '@urql/svelte';

export const client = createClient({
  url: 'https://your-api-endpoint.com/graphql', // Replace with your GraphQL API URL
});

import type { Standing } from "../domain/standing";

export let sortOrder: 'asc' | 'desc' = 'asc';

export function sortStandings(standings: Standing[], sortKey: keyof Standing, sortOrder: 'asc' | 'desc'): Standing[] {
  return standings.sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    // Handle null/undefined values - put them at the end regardless of sort order
    if (aValue === null || aValue === undefined) {
      return bValue === null || bValue === undefined ? 0 : 1;
    }
    if (bValue === null || bValue === undefined) {
      return -1;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}


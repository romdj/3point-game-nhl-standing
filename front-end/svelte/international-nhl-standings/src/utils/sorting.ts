import type { Standing } from "../domain/standing";

export let sortOrder: 'asc' | 'desc' = 'asc';

export function sortStandings(standings: Standing[], sortKey: keyof Standing, sortOrder: 'asc' | 'desc'): Standing[] {
  return standings.sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (aValue === undefined || bValue === undefined) {
      return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}

export function setSort(
  standings: Standing[],
  sortKey: keyof Standing,
  sortOrder: 'asc' | 'desc',
  newSortKey: keyof Standing
): { sortedStandings: Standing[], newSortOrder: 'asc' | 'desc' } {
  const sortedStandings = sortStandings(standings, sortKey, sortOrder);
  return { sortedStandings, newSortOrder: sortOrder };
}

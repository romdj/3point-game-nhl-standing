<script lang="ts">
  import { writable } from 'svelte/store';
  import { PointSystem, type Standing } from '../domain/standing';
  import { standingsStore } from '../stores/standingsStore';
  import { viewTypeStore } from '../stores/viewStore';
  import { setSort } from '../utils/sorting';
  import { organizeStandings } from '../utils/standingsOrganizer';

  let sortOrder: 'desc' | 'asc' = 'desc';
  let standings: Standing[] = [];
  let sortKey: keyof Standing = 'internationalSystemPoints';
  let selectedSystem = writable<PointSystem>(PointSystem.International);

  standingsStore.subscribe((value) => {
    standings = value;
    // Initial sort by INTL Points system
    standings = setSort(standings, 'internationalSystemPoints', 'desc', 'internationalSystemPoints').sortedStandings;
  });

  function handleSort(key: keyof Standing) {
    if (sortKey === key) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortOrder = 'desc';
    }
    sortKey = key;
    const result = setSort(standings, sortKey, sortOrder, key);
    standings = result.sortedStandings;
    sortOrder = result.newSortOrder;
  }

  $: groupedStandings = organizeStandings(standings, $viewTypeStore);

  const columns = [
    { key: 'teamName', label: 'Team', width: 'w-48' },
    { key: 'gamesPlayed', label: 'GP', width: 'w-16' },
    { key: 'wins', label: 'W', width: 'w-16' },
    { key: 'losses', label: 'L', width: 'w-16' },
    { key: 'otLosses', label: 'OTL', width: 'w-16' },
    { key: 'points', label: 'PTS', width: 'w-16' },
    { key: 'internationalSystemPoints', label: 'IIHF PTS', width: 'w-20' },
  ];
</script>

<div class="w-full max-w-6xl mx-auto px-4">

  {#each Object.entries(groupedStandings) as [groupName, groupTeams]}
    <div class="mb-8">
      <h3 class="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
        {groupName}
        {#if groupName.includes('Division Winners')}
          <span class="text-sm font-normal text-gray-500 ml-2">(First Round Home Ice)</span>
        {/if}
      </h3>
      {#if groupTeams.length > 0}
        <div class="overflow-x-auto bg-white rounded-lg shadow">
          <table class="min-w-full table-auto">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-12">#</th>
                {#each columns as column}
                  <th 
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 {column.width}"
                    on:click={() => handleSort(column.key)}
                  >
                    <div class="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {#if sortKey === column.key}
                        <span class="text-blue-500">
                          {sortOrder === 'desc' ? '↓' : '↑'}
                        </span>
                      {/if}
                    </div>
                  </th>
                {/each}
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each groupTeams as standing, index}
                <tr class="hover:bg-gray-50 transition-colors duration-150 {groupName.includes('Wild Card') ? 'bg-gray-50' : ''}">
                  <td class="px-4 py-3 text-sm text-center">{index + 1}</td>
                  {#each columns as column}
                    <td class="px-4 py-3 text-sm {column.key === 'teamName' ? 'font-medium' : 'text-center'}">
                      {standing[column.key]}
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <p class="text-gray-500 italic">No teams in this group</p>
      {/if}
    </div>
  {/each}
</div>

<style>
  th {
    position: sticky;
    top: 0;
    z-index: 10;
  }
</style>

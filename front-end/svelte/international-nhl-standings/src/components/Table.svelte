<script lang="ts">
  import { writable } from 'svelte/store';
  import { PointSystem, type Standing } from '../domain/standing';
  import { standingsStore } from '../stores/standingsStore';
  import { viewTypeStore } from '../stores/viewStore';
  import { setSort } from '../utils/sorting';
  import InternationalSelector from './InternationalSelector.svelte';

  let sortOrder: 'desc' | 'asc' = 'desc';
  let standings: Standing[] = [];
  let sortKey: keyof Standing = 'points';
  let selectedSystem = writable<PointSystem>(PointSystem.International);

  standingsStore.subscribe((value) => {
    standings = value;
    // Initial sort by INTL Points system
    standings = setSort(standings, 'internationalSystemPoints', 'desc', 'points').sortedStandings;
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

  $: displayStandings = standings;

  const columns = [
    { key: 'teamName', label: 'Team', width: 'w-48' },
    { key: 'gamesPlayed', label: 'GP', width: 'w-16' },
    { key: 'wins', label: 'W', width: 'w-16' },
    { key: 'losses', label: 'L', width: 'w-16' },
    { key: 'otLosses', label: 'OTL', width: 'w-16' },
    { key: 'points', label: 'PTS', width: 'w-16' },
    { key: 'internationalSystemPoints', label: 'IIHF PTS', width: 'w-20' },
    { key: 'divisionName', label: 'DIVISION', width: 'w-20' },
  ];
</script>

<div class="w-full max-w-6xl mx-auto px-4">
  <div class="mb-4 flex justify-between items-center">
    <h2 class="text-xl font-bold">{$viewTypeStore.charAt(0).toUpperCase() + $viewTypeStore.slice(1)} Standings</h2>
    <InternationalSelector bind:selectedSystem />
  </div>

  <div class="overflow-x-auto bg-white rounded-lg shadow">
    <table class="min-w-full table-auto">
      <thead>
        <tr class="bg-gray-50 border-b border-gray-200">
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
        {#each displayStandings as standing}
          <tr class="hover:bg-gray-50 transition-colors duration-150">
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
</div>

<style>
  th {
    position: sticky;
    top: 0;
    z-index: 10;
  }
</style>

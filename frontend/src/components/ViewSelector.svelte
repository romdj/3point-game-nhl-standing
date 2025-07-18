<script lang="ts">
  import { viewTypeStore, type ViewType } from '../stores/viewStore';
  import { getCurrentNHLSeasonYear, getSeasonString, isInSeason, hasSeasonData } from '../utils/seasonUtils';

  const views: { id: ViewType; label: string }[] = [
    { id: 'division', label: 'Division' },
    { id: 'wildcard', label: 'Wild Card' },
    { id: 'conference', label: 'Conference' },
    { id: 'league', label: 'League' }
  ];

  const currentSeasonYear = getCurrentNHLSeasonYear();
  const seasonString = getSeasonString(currentSeasonYear);
  const inSeason = isInSeason();
  const hasData = hasSeasonData(currentSeasonYear);
</script>

<div class="flex flex-col items-center space-y-4 mb-6">
  <!-- Season Information -->
  <div class="text-center">
    <h2 class="text-lg font-semibold text-gray-800">
      NHL Season {seasonString}
    </h2>
    <p class="text-sm text-gray-600">
      {#if inSeason && hasData}
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <span class="w-2 h-2 mr-1 bg-green-400 rounded-full"></span>
          In Season
        </span>
      {:else if !inSeason && hasData}
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <span class="w-2 h-2 mr-1 bg-gray-400 rounded-full"></span>
          Off Season - Final Standings
        </span>
      {:else}
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          <span class="w-2 h-2 mr-1 bg-amber-400 rounded-full"></span>
          {hasData ? 'Historical Data' : 'No Data Available - Showing 2022-2023'}
        </span>
      {/if}
    </p>
  </div>

  <!-- View Selector -->
  <div class="flex justify-center space-x-2">
    {#each views as view}
      <button
        class="px-4 py-2 rounded-lg transition-colors duration-200 {$viewTypeStore === view.id ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}"
        on:click={() => viewTypeStore.set(view.id)}
      >
        {view.label}
      </button>
    {/each}
  </div>
</div> 
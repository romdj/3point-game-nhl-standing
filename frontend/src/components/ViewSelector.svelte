<script lang="ts">
  import { viewTypeStore, type ViewType } from '../stores/viewStore';
  import { getCurrentNHLSeasonYear, getSeasonString, isInSeason, hasSeasonData } from '../utils/seasonUtils';

  const views: { id: ViewType; label: string }[] = [
    { id: 'division', label: 'Division' },
    { id: 'wildcard', label: 'Wild Card' },
    { id: 'conference', label: 'Conference' },
    { id: 'league', label: 'League' },
    { id: 'comparison', label: 'Historical Comparison' }
  ];

  const currentSeasonYear = getCurrentNHLSeasonYear();
  const seasonString = getSeasonString(currentSeasonYear);
  const inSeason = isInSeason();
  const hasData = hasSeasonData(currentSeasonYear);
</script>

<div class="flex flex-col items-center space-y-6 mb-8">
  <!-- Season Information -->
  <div class="text-center">
    <h2 class="text-xl font-semibold text-base-content mb-2">
      NHL Season {seasonString}
    </h2>
    <div class="text-sm">
      {#if inSeason && hasData}
        <div class="badge badge-success gap-2">
          <div class="w-2 h-2 bg-success-content rounded-full"></div>
          In Season
        </div>
      {:else if !inSeason && hasData}
        <div class="badge badge-neutral gap-2">
          <div class="w-2 h-2 bg-neutral-content rounded-full"></div>
          Off Season - Final Standings
        </div>
      {:else}
        <div class="badge badge-warning gap-2">
          <div class="w-2 h-2 bg-warning-content rounded-full"></div>
          {hasData ? 'Historical Data' : 'No Data Available - Showing 2022-2023'}
        </div>
      {/if}
    </div>
  </div>

  <!-- View Selector -->
  <div class="tabs tabs-boxed bg-base-200">
    {#each views as view}
      <button
        class="tab {$viewTypeStore === view.id ? 'tab-active' : ''}"
        on:click={() => viewTypeStore.set(view.id)}
      >
        {view.label}
      </button>
    {/each}
  </div>
</div> 
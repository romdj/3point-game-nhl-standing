<script lang="ts">
  import type { Standing, StandingTableColumn } from '../../domain/standing';
  import { standingsStore } from '../../stores/standingsStore';
  import { viewTypeStore } from '../../stores/viewStore';
  import { fade, slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { DEFAULT_SORT_KEY, DEFAULT_SORT_ORDER, ANIMATION_DURATIONS, TABLE_COLUMN_WIDTHS } from '../../constants/index.js';
  import ConferenceCard from './ConferenceCard.svelte';
  import TableSection from './TableSection.svelte';
  import { GetOrganizedStandingsUseCase, StandingsSortingService, type SortKey, type SortOrder } from '../../business';

  let sortOrder: SortOrder = DEFAULT_SORT_ORDER;
  let standings: Standing[] = [];
  let sortKey: SortKey = DEFAULT_SORT_KEY;
  let groupedStandings: Record<string, Standing[]> = {};
  
  // Track previous standings for position changes
  let previousStandings: Record<string, number> = {};

  // Business logic services
  const getOrganizedStandingsUseCase = new GetOrganizedStandingsUseCase();
  const _sortingService = new StandingsSortingService();

  standingsStore.subscribe((value) => {
    // Store previous positions before updating
    if (standings.length > 0) {
      previousStandings = standings.reduce((acc, team, index) => {
        acc[team.teamName] = index;
        return acc;
      }, {} as Record<string, number>);
    }
    
    standings = value;
    // Update grouped standings when data changes
    updateGroupedStandings();
  });

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortOrder = 'desc';
    }
    sortKey = key;
    updateGroupedStandings();
  }

  async function updateGroupedStandings() {
    try {
      groupedStandings = await getOrganizedStandingsUseCase.execute({
        viewType: $viewTypeStore,
        sortKey,
        sortOrder
      });
    } catch (error) {
      console.error('Failed to update grouped standings:', error);
      // Fallback to empty state
      groupedStandings = {};
    }
  }

  // Update grouped standings when view type changes
  $: if ($viewTypeStore) {
    updateGroupedStandings();
  }

  // Fix the conferencePairs definition
  $: conferencePairs = ($viewTypeStore === 'conference' || $viewTypeStore === 'wildcard' || $viewTypeStore === 'division') ? 
    Object.entries(groupedStandings).reduce((acc, [name, teams]) => {
      // Handle conference view (names include "Western" or "Eastern")
      if (name.includes('Western')) {
        if (!acc[0]) acc[0] = {};
        acc[0][name] = teams;
      }
      else if (name.includes('Eastern')) {
        if (!acc[1]) acc[1] = {};
        acc[1][name] = teams;
      }
      // Handle division view (division names: Atlantic, Metropolitan, Pacific, Central)
      else if ($viewTypeStore === 'division') {
        // Western Conference divisions: Pacific, Central
        if (name === 'Pacific' || name === 'Central') {
          if (!acc[0]) acc[0] = {};
          acc[0][name] = teams;
        }
        // Eastern Conference divisions: Atlantic, Metropolitan
        else if (name === 'Atlantic' || name === 'Metropolitan') {
          if (!acc[1]) acc[1] = {};
          acc[1][name] = teams;
        }
      }
      return acc;
    }, [{}, {}] as Array<Record<string, Standing[]>>) : null;

  const columns: StandingTableColumn[] = [
    { key: 'teamName', label: 'Team', width: TABLE_COLUMN_WIDTHS.TEAM_NAME },
    { key: 'gamesPlayed', label: 'GP', width: TABLE_COLUMN_WIDTHS.SMALL_STAT },
    { key: 'wins', label: 'W', width: TABLE_COLUMN_WIDTHS.SMALL_STAT },
    { key: 'losses', label: 'L', width: TABLE_COLUMN_WIDTHS.SMALL_STAT },
    { key: 'otLosses', label: 'OTL', width: TABLE_COLUMN_WIDTHS.SMALL_STAT },
    { key: 'points', label: 'PTS', width: TABLE_COLUMN_WIDTHS.SMALL_STAT },
    { key: 'internationalSystemPoints', label: 'IIHF PTS', width: TABLE_COLUMN_WIDTHS.MEDIUM_STAT },
    { key: 'minutesPerPowerplayGoal', label: 'Min/PPG', width: TABLE_COLUMN_WIDTHS.POWERPLAY_STAT, tooltip: 'Minutes per powerplay goal - lower is better' },
    { key: 'powerplayPercentage', label: 'PP%', width: TABLE_COLUMN_WIDTHS.SMALL_STAT, tooltip: 'Traditional powerplay percentage' },
  ];
</script>

<div class="w-full max-w-7xl mx-auto" in:fade={{ duration: ANIMATION_DURATIONS.FADE, easing: quintOut }}>
  <div class="mb-6 flex flex-col sm:flex-row justify-between items-center bg-base-100 rounded-lg shadow-sm p-4 border border-base-200">
    <h2 class="text-2xl font-bold text-base-content mb-3 sm:mb-0">
      {$viewTypeStore.charAt(0).toUpperCase() + $viewTypeStore.slice(1)} Standings
    </h2>
  </div>

  <!-- All views now use the side-by-side layout for conferences -->
  {#if ($viewTypeStore === 'wildcard' || $viewTypeStore === 'conference' || $viewTypeStore === 'division') && conferencePairs}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8" in:slide={{ duration: ANIMATION_DURATIONS.SLIDE, easing: quintOut }}>
      {#each conferencePairs as conferenceGroups, i}
        <ConferenceCard 
          conferenceIndex={i}
          {conferenceGroups}
          {columns}
          {sortKey}
          {sortOrder}
          onSort={handleSort}
          {previousStandings}
          viewType={$viewTypeStore}
        />
      {/each}
    </div>
  {:else}
    <!-- League View - Full Width -->
    <div class="space-y-8" in:slide={{ duration: ANIMATION_DURATIONS.SLIDE, easing: quintOut }}>
      {#each Object.entries(groupedStandings) as [groupName, groupTeams]}
        <div class="card bg-base-100 shadow-lg border border-base-200">
          <div class="card-header bg-gradient-primary text-primary-content p-4">
            <h3 class="text-xl font-bold group relative">
              {groupName}
              {#if groupName.includes('Wild Card')}
                <span class="ml-2 text-sm font-normal opacity-90">(Playoff Qualifiers)</span>
              {/if}
              <!-- Tooltip on hover -->
              <div class="tooltip tooltip-bottom" data-tip="League-wide standings">
                <button class="btn btn-ghost btn-xs opacity-70 hover:opacity-100 ml-2">
                  ℹ️
                </button>
              </div>
            </h3>
          </div>
          
          {#if groupTeams.length > 0}
            <div class="card-body p-0">
              <TableSection 
                {groupName} 
                teams={groupTeams} 
                {columns} 
                {sortKey} 
                {sortOrder} 
                onSort={handleSort}
                {previousStandings}
                showSectionTitle={false}
              />
            </div>
          {:else}
            <div class="card-body">
              <div class="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>No teams in this group</span>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
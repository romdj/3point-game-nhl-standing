<script lang="ts">
  import type { Standing, StandingTableColumn } from '../../domain/standing';
  import { slide } from 'svelte/transition';
  import TableHeader from './TableHeader.svelte';
  import TableRow from './TableRow.svelte';
  import SectionHeader from './SectionHeader.svelte';
  import { StandingsGroupingService, type SortKey, type SortOrder } from '../../business';

  export let groupName: string;
  export let teams: Standing[];
  export let columns: StandingTableColumn[];
  export let sortKey: SortKey;
  export let sortOrder: SortOrder;
  export let onSort: (_key: SortKey) => void;
  export let previousStandings: Record<string, number> = {};
  export let showSectionTitle: boolean = false;
  export let allStandings: Standing[] = []; // For percentile calculations

  // Business logic service
  const groupingService = new StandingsGroupingService();

  // Get section info using business logic
  $: _sectionInfo = groupingService.getSectionInfo(groupName);

  // Get playoff status for styling
  function getPlayoffStatus(groupName: string, index: number): 'division-leader' | 'wildcard' | 'race' | 'non-playoff' {
    return groupingService.getPlayoffStatus(groupName, index);
  }

  // Get position change indicator
  function getPositionChange(teamName: string, currentIndex: number): { icon: string, class: string } {
    if (!previousStandings[teamName]) {
      return { icon: '-', class: 'text-base-content/40' };
    }
    
    const prevIndex = previousStandings[teamName];
    if (prevIndex < currentIndex) {
      return { icon: '↓', class: 'text-error' };
    } else if (prevIndex > currentIndex) {
      return { icon: '↑', class: 'text-success' };
    } else {
      return { icon: '-', class: 'text-base-content/40' };
    }
  }

</script>

<div class="p-4 {showSectionTitle ? 'border-b border-base-200' : ''}" transition:slide={{ duration: 300 }}>
  {#if showSectionTitle}
    <div class="text-md mb-3">
      <SectionHeader {groupName} showDescription={true} />
    </div>
  {/if}
  
  <div class="overflow-x-auto">
    <table class="table table-zebra w-full">
      <TableHeader {columns} {sortKey} {sortOrder} {onSort} />
      <tbody>
        {#each teams as standing, index}
          {@const playoffStatus = getPlayoffStatus(groupName, index)}
          {@const _positionChange = getPositionChange(standing.teamName, index)}
          <TableRow 
            {standing} 
            {index} 
            {columns} 
            {playoffStatus} 
            {previousStandings}
            {allStandings}
          />
        {/each}
      </tbody>
    </table>
  </div>
</div>


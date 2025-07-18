<script lang="ts">
  import type { Standing } from '../../domain/standing';
  import { slide } from 'svelte/transition';
  import TableHeader from './TableHeader.svelte';
  import TableRow from './TableRow.svelte';

  export let groupName: string;
  export let teams: Standing[];
  export let columns: Array<{ key: keyof Standing; label: string; width: string }>;
  export let sortKey: keyof Standing;
  export let sortOrder: 'asc' | 'desc';
  export let onSort: (_key: keyof Standing) => void;
  export let previousStandings: Record<string, number> = {};
  export let showSectionTitle: boolean = false;

  // Helper function to get section title and description
  function getSectionInfo(groupName: string) {
    if (groupName.includes('Wild Card')) {
      return {
        title: 'Wild Card',
        description: 'Current playoff qualifiers via wild card spots',
        icon: '🌟'
      };
    } else if (groupName.includes('Race')) {
      return {
        title: 'Playoff Race',
        description: 'Teams within 7 points of the final wild card spot',
        icon: '🏁'
      };
    } else if (groupName.includes('Rest')) {
      return {
        title: 'Rest of Conference',
        description: 'Teams more than 7 points out of a playoff spot',
        icon: '📊'
      };
    } else {
      // Division
      const divisionName = groupName.split(' - ')[1] || groupName;
      return {
        title: divisionName,
        description: 'Top 3 teams qualify for playoffs',
        icon: '🏆'
      };
    }
  }

  // Get playoff status for styling
  function getPlayoffStatus(groupName: string, index: number): string {
    if (groupName.includes('Wild Card')) {
      return 'wildcard';
    } else if (!groupName.includes('Race') && !groupName.includes('Rest') && index < 3) {
      return 'division-leader';
    } else if (groupName.includes('Race')) {
      return 'race';
    }
    return 'non-playoff';
  }

  // Get position change indicator
  function getPositionChange(teamName: string, currentIndex: number): { icon: string, class: string } {
    if (!previousStandings[teamName]) {
      return { icon: '-', class: 'text-gray-400' };
    }
    
    const prevIndex = previousStandings[teamName];
    if (prevIndex < currentIndex) {
      return { icon: '↓', class: 'text-red-500' };
    } else if (prevIndex > currentIndex) {
      return { icon: '↑', class: 'text-green-500' };
    } else {
      return { icon: '-', class: 'text-gray-400' };
    }
  }

  $: sectionInfo = getSectionInfo(groupName);
</script>

<div class="p-4 {showSectionTitle ? 'border-b' : ''}" transition:slide={{ duration: 300 }}>
  {#if showSectionTitle}
    <h4 class="text-md font-semibold mb-3 text-gray-700 flex items-center group relative">
      <span class="mr-2">{sectionInfo.icon}</span>
      <span>{sectionInfo.title}</span>
      <!-- Tooltip on hover -->
      <span class="invisible group-hover:visible absolute left-0 top-full mt-1 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 w-48">
        {sectionInfo.description}
      </span>
    </h4>
  {/if}
  
  <div class="overflow-x-auto rounded-lg">
    <table class="min-w-full table-auto">
      <TableHeader {columns} {sortKey} {sortOrder} {onSort} />
      <tbody class="divide-y divide-gray-200">
        {#each teams as standing, index}
          {@const playoffStatus = getPlayoffStatus(groupName, index)}
          {@const positionChange = getPositionChange(standing.teamName, index)}
          <TableRow 
            {standing} 
            {index} 
            {columns} 
            {playoffStatus} 
            {positionChange}
          />
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  /* Tooltip positioning */
  .group {
    position: relative;
  }
</style>
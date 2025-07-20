<script lang="ts">
  import type { Standing } from '../../domain/standing';
  import PlayoffStatusIndicator from './PlayoffStatusIndicator.svelte';
  import PositionChangeIndicator from './PositionChangeIndicator.svelte';

  export let standing: Standing;
  export let index: number;
  export let columns: Array<{ key: keyof Standing; label: string; width: string }>;
  export let playoffStatus: 'division-leader' | 'wildcard' | 'race' | 'non-playoff' = 'non-playoff';
  export let previousStandings: Record<string, number> = {};

  // Get team row background color based on status
  function getRowBackground(status: string): string {
    switch (status) {
      case 'division-leader': return 'bg-primary/10 hover:bg-primary/20';
      case 'wildcard': return 'bg-success/10 hover:bg-success/20';
      case 'race': return 'bg-warning/10 hover:bg-warning/20';
      default: return 'hover:bg-base-200';
    }
  }

  // Get text color based on status
  function getTextColor(status: string, isTeamName: boolean): string {
    if (!isTeamName) return 'text-base-content';
    
    switch (status) {
      case 'division-leader': return 'text-primary font-semibold';
      case 'wildcard': return 'text-success font-semibold';
      case 'race': return 'text-warning font-semibold';
      default: return 'text-base-content';
    }
  }
</script>

<tr class="transition-all duration-150 {getRowBackground(playoffStatus)}">
  <td class="px-3 py-3 text-sm font-medium text-base-content">
    <div class="flex items-center space-x-2">
      <span class="mr-1">{Number(index) + 1}</span>
      <PositionChangeIndicator 
        teamName={standing.teamName} 
        currentPosition={Number(index)} 
        {previousStandings} 
      />
      <PlayoffStatusIndicator status={playoffStatus} />
    </div>
  </td>
  {#each columns as column}
    <td class="text-sm {column.key === 'teamName' ? 'font-medium' : 'text-center'} {getTextColor(playoffStatus, column.key === 'teamName')}">
      {#if column.key === 'teamName'}
        <div class="flex items-center gap-3">
          {#if standing.teamLogo}
            <img 
              src={standing.teamLogo} 
              alt="{standing.teamName} logo"
              class="w-6 h-6"
              loading="lazy"
            />
          {/if}
          <span>{standing[column.key]}</span>
        </div>
      {:else}
        {standing[column.key]}
      {/if}
    </td>
  {/each}
</tr>

<style>
  /* Subtle hover effect for table rows */
  tr:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  
  /* Smooth transitions */
  tr, td {
    transition: all 0.2s ease;
  }
</style>
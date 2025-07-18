<script lang="ts">
  import type { Standing } from '../../domain/standing';

  export let standing: Standing;
  export let index: number;
  export let columns: Array<{ key: keyof Standing; label: string; width: string }>;
  export let playoffStatus: string = 'non-playoff';
  export let positionChange: { icon: string; class: string } = { icon: '-', class: 'text-gray-400' };

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
  <td class="text-sm font-medium text-base-content">
    <div class="flex items-center">
      <span class="mr-2">{index + 1}</span>
      <span class="{positionChange.class}">{positionChange.icon}</span>
    </div>
  </td>
  {#each columns as column}
    <td class="text-sm {column.key === 'teamName' ? 'font-medium' : 'text-center'} {getTextColor(playoffStatus, column.key === 'teamName')}">
      {standing[column.key]}
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
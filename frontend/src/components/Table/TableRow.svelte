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
      case 'division-leader': return 'bg-blue-50 hover:bg-blue-100';
      case 'wildcard': return 'bg-green-50 hover:bg-green-100';
      case 'race': return 'bg-yellow-50 hover:bg-yellow-100';
      default: return 'hover:bg-gray-50';
    }
  }
</script>

<tr class="transition-all duration-150 {getRowBackground(playoffStatus)}">
  <td class="px-3 py-3 text-sm font-medium {playoffStatus === 'division-leader' ? 'text-blue-700' : 'text-gray-700'}">
    <div class="flex items-center">
      <span class="mr-2">{index + 1}</span>
      <span class="{positionChange.class}">{positionChange.icon}</span>
    </div>
  </td>
  {#each columns as column}
    <td class="px-3 py-3 text-sm 
      {column.key === 'teamName' ? 'font-medium' : 'text-center'}
      {playoffStatus === 'division-leader' && column.key === 'teamName' ? 'text-blue-700' : ''}
      {playoffStatus === 'wildcard' && column.key === 'teamName' ? 'text-green-700' : ''}
      {playoffStatus === 'race' && column.key === 'teamName' ? 'text-yellow-700' : ''}">
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
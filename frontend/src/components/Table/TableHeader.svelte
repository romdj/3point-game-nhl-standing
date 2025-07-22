<script lang="ts">
  import type { Standing, StandingTableColumn } from '../../domain/standing';

  export let columns: StandingTableColumn[];
  export let sortKey: keyof Standing;
  export let sortOrder: 'asc' | 'desc';
  export let onSort: (_key: keyof Standing) => void;

  const handleSort = (key: keyof Standing) => {
    onSort(key);
  };

  // Check if column is sortable - all Standing fields including powerplay stats
  const isSortableColumn = (key: StandingTableColumn['key']): key is keyof Standing => {
    return true; // All Standing fields are now sortable
  };
</script>

<thead>
  <tr>
    <th class="text-left font-semibold text-base-content w-16">Pos</th>
    {#each columns as column}
      <th 
        class="text-left font-semibold text-base-content {isSortableColumn(column.key) ? 'cursor-pointer hover:bg-base-200' : 'cursor-default'} transition-colors duration-150 select-none"
        on:click={() => isSortableColumn(column.key) && handleSort(column.key)}
        title={column.tooltip || ''}
      >
        <div class="flex items-center space-x-1">
          <span>{column.label}</span>
          {#if isSortableColumn(column.key) && sortKey === column.key}
            <span class="text-primary text-sm">
              {sortOrder === 'desc' ? '↓' : '↑'}
            </span>
          {/if}
        </div>
      </th>
    {/each}
  </tr>
</thead>

<style>
  th {
    position: sticky;
    top: 0;
    z-index: 10;
  }
</style>